import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

const providerCalls = vi.hoisted(() => ({ mail: vi.fn(), upload: vi.fn(), destroy: vi.fn() }));
vi.mock('@sendgrid/mail', () => ({ default: { send: providerCalls.mail, setApiKey: vi.fn() } }));
vi.mock('cloudinary', () => ({ v2: { config: vi.fn(), uploader: { upload: providerCalls.upload, destroy: providerCalls.destroy } } }));
import { createApp } from '../app';
import { signAccessToken } from '../auth/accessToken';
import User from '../models/userModel';

const app = createApp();

describe('disabled outbound integrations', () => {
  it('blocks uploads and creates no undeliverable password-reset state', async () => {
    const user = await User.create({
      firstName: 'Local', lastName: 'Tester', email: 'local@example.invalid',
      password: 'synthetic-hash', birthday: new Date('2000-01-01'), photoURL: 'local-default-profile.png',
    });
    const imageResponse = await request(app).patch('/api/users/image')
      .set('Authorization', `Bearer ${signAccessToken(user.id)}`)
      .attach('photoURL', Buffer.from('image'), { filename: 'x.png', contentType: 'image/png' });
    expect(imageResponse.status).toBe(503);
    const resetResponse = await request(app).post('/api/auth/password-reset/request').send({ email: user.email });
    expect(resetResponse.status).toBe(202);
    expect((await User.findById(user.id).select('+passwordReset'))?.passwordReset).toBeUndefined();
    expect(providerCalls.mail).not.toHaveBeenCalled();
    expect(providerCalls.upload).not.toHaveBeenCalled();
    expect(providerCalls.destroy).not.toHaveBeenCalled();
  });
});
