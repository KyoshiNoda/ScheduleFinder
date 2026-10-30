import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const imageMocks = vi.hoisted(() => ({
  upload: vi.fn(),
  destroy: vi.fn(),
}));
vi.mock('../integrations/outbound', () => ({
  outboundEnabled: () => true,
  uploadProfileImage: imageMocks.upload,
  destroyProfileImage: imageMocks.destroy,
}));

import { createApp } from '../app';
import { signAccessToken } from '../auth/accessToken';
import User from '../models/userModel';

const app = createApp();
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
let sequence = 0;
const createUser = async () => {
  sequence += 1;
  return User.create({
    firstName: 'Image', lastName: 'Tester', email: `image-${sequence}@example.invalid`,
    password: 'synthetic-hash', birthday: new Date('2000-01-01'),
    photoURL: 'local-default-profile.png',
  });
};
const upload = (userId: string) => request(app).patch('/api/users/image')
  .set('Authorization', `Bearer ${signAccessToken(userId)}`);

beforeEach(() => {
  imageMocks.upload.mockReset().mockResolvedValue({ secureUrl: 'https://example.invalid/new.png', publicId: 'uploads/new' });
  imageMocks.destroy.mockReset().mockResolvedValue(undefined);
});

describe('profile image uploads', () => {
  it('rejects a missing file, unsupported bytes, mismatched MIME, and oversized input before provider calls', async () => {
    const user = await createUser();
    expect((await upload(user.id).set('Content-Type', 'multipart/form-data')).status).toBe(400);
    expect((await upload(user.id).attach('photoURL', Buffer.from('not an image'), { filename: 'x.png', contentType: 'image/png' })).status).toBe(415);
    expect((await upload(user.id).attach('photoURL', png, { filename: 'x.jpg', contentType: 'image/jpeg' })).status).toBe(415);
    expect((await upload(user.id).attach('photoURL', Buffer.alloc(5 * 1024 * 1024 + 1), { filename: 'x.png', contentType: 'image/png' })).status).toBe(413);
    expect(imageMocks.upload).not.toHaveBeenCalled();
  });

  it('uploads before replacing the URL and deletes only a recorded old public ID', async () => {
    const user = await createUser();
    await User.updateOne({ _id: user.id }, { $set: { profileImagePublicId: 'uploads/old' } });
    const response = await upload(user.id).attach('photoURL', png, { filename: 'x.png', contentType: 'image/png' });
    const updated = await User.findById(user.id).select('+profileImagePublicId');
    expect(response.status).toBe(200);
    expect(updated?.photoURL).toBe('https://example.invalid/new.png');
    expect(updated?.profileImagePublicId).toBe('uploads/new');
    expect(imageMocks.upload).toHaveBeenCalledWith(expect.stringMatching(/^data:image\/png;base64,/));
    expect(imageMocks.destroy).toHaveBeenCalledWith('uploads/old');
  });

  it('preserves the old URL on provider failure and removes a new asset on database failure', async () => {
    const user = await createUser();
    imageMocks.upload.mockRejectedValueOnce(new Error('provider failure'));
    expect((await upload(user.id).attach('photoURL', png, { filename: 'x.png', contentType: 'image/png' })).status).toBe(502);
    expect((await User.findById(user.id))?.photoURL).toBe('local-default-profile.png');

    const spy = vi.spyOn(User, 'findOneAndUpdate').mockImplementationOnce(() => { throw new Error('database failure'); });
    try {
      expect((await upload(user.id).attach('photoURL', png, { filename: 'x.png', contentType: 'image/png' })).status).toBe(500);
    } finally { spy.mockRestore(); }
    expect(imageMocks.destroy).toHaveBeenCalledWith('uploads/new');
    expect((await User.findById(user.id))?.photoURL).toBe('local-default-profile.png');
  });

  it('resets the URL before deleting a managed image and handles a missing user', async () => {
    const user = await createUser();
    await User.updateOne({ _id: user.id }, { $set: { profileImagePublicId: 'uploads/old' } });
    expect((await request(app).delete('/api/users/image').set('Authorization', `Bearer ${signAccessToken(user.id)}`)).status).toBe(200);
    expect(imageMocks.destroy).toHaveBeenCalledWith('uploads/old');
    expect((await User.findById(user.id).select('+profileImagePublicId'))?.profileImagePublicId).toBeUndefined();
    await User.deleteOne({ _id: user.id });
    expect((await request(app).delete('/api/users/image').set('Authorization', `Bearer ${signAccessToken(user.id)}`)).status).toBe(404);
  });

  it('keeps a saved replacement when cleanup of the old asset fails', async () => {
    const user = await createUser();
    await User.updateOne({ _id: user.id }, { $set: { profileImagePublicId: 'uploads/old' } });
    imageMocks.destroy.mockRejectedValueOnce(new Error('provider cleanup failure'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const response = await upload(user.id).attach('photoURL', png, { filename: 'x.png', contentType: 'image/png' });
      expect(response.status).toBe(200);
      expect((await User.findById(user.id))?.photoURL).toBe('https://example.invalid/new.png');
      expect(log).toHaveBeenCalledWith('Unable to remove a managed profile image.');
    } finally { log.mockRestore(); }
  });
});
