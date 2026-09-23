import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';
import User, { IUser } from '../models/userModel';

const app = createApp();
const publicUserKeys = [
  '_id',
  'age',
  'firstName',
  'gender',
  'hobbies',
  'lastName',
  'major',
  'photoURL',
  'school',
].sort();
const privateUserKeys = [...publicUserKeys, 'birthday', 'email'].sort();
const authUserKeys = ['_id', 'email', 'firstName', 'lastName', 'photoURL'].sort();

let userSequence = 0;

const createUser = async (overrides: Partial<IUser> = {}): Promise<IUser> => {
  userSequence += 1;

  return User.create({
    firstName: 'Test',
    lastName: `Student ${userSequence}`,
    email: `student-${userSequence}@example.invalid`,
    password: 'synthetic-password-hash',
    birthday: new Date('2000-01-01T00:00:00.000Z'),
    school: 'Test University',
    major: 'Computer Science',
    gender: 'Other',
    photoURL: 'local-default-profile.png',
    hobbies: ['reading'],
    ...overrides,
  });
};

const createToken = (user: IUser): string => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is required for integration tests');
  }

  return jwt.sign({}, accessTokenSecret, { subject: user.id, expiresIn: '5m' });
};

const expectExactKeys = (value: Record<string, unknown>, keys: string[]) => {
  expect(Object.keys(value).sort()).toEqual(keys);
};

const expectPublicUser = (value: Record<string, unknown>) => {
  expectExactKeys(value, publicUserKeys);
  expect(value.age).toEqual(expect.any(Number));
  expect(value).not.toHaveProperty('birthday');
  expect(value).not.toHaveProperty('email');
};

const expectPrivateUser = (value: Record<string, unknown>) => {
  expectExactKeys(value, privateUserKeys);
  expect(value.birthday).toEqual(expect.any(String));
};

const expectAuthUser = (value: Record<string, unknown>) => {
  expectExactKeys(value, authUserKeys);
};

describe('safe user HTTP responses', () => {
  it('returns only the authentication representation from registration', async () => {
    const response = await request(app).post('/api/auth/register').send({
      firstName: 'Registered',
      lastName: 'Student',
      email: 'registered.student@example.invalid',
      password: 'test-password',
      school: 'Test University',
      birthday: '2000-01-01T00:00:00.000Z',
    });

    expect(response.status).toBe(200);
    expectAuthUser(response.body.user);
  });

  it('returns only the authentication representation from login', async () => {
    const password = 'test-password';
    const user = await createUser({ password: await bcrypt.hash(password, 4) });
    const response = await request(app).post('/api/auth/login').send({
      email: user.email,
      password,
    });

    expect(response.status).toBe(200);
    expectAuthUser(response.body.user);
  });

  it('hides password by default at the model query boundary', async () => {
    const user = await createUser();

    const defaultUser = await User.findById(user.id);
    const passwordSelectedUser = await User.findById(user.id).select('+password');

    expect(defaultUser?.password).toBeUndefined();
    expect(passwordSelectedUser?.password).toBe('synthetic-password-hash');
  });

  it('returns the private representation for self read and update', async () => {
    const user = await createUser();
    const token = createToken(user);
    const readResponse = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    const updateResponse = await request(app)
      .patch('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Updated' });

    expect(readResponse.status).toBe(200);
    expectPrivateUser(readResponse.body);
    expect(updateResponse.status).toBe(200);
    expectPrivateUser(updateResponse.body);
    expect(updateResponse.body.firstName).toBe('Updated');
  });

  it('returns public representations for discovery and external profiles', async () => {
    const viewer = await createUser();
    const user = await createUser();
    const token = createToken(viewer);
    const listResponse = await request(app)
      .get('/api/users/allUsers')
      .set('Authorization', `Bearer ${token}`);
    const profileResponse = await request(app)
      .get(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(2);
    listResponse.body.forEach(expectPublicUser);
    expect(profileResponse.status).toBe(200);
    expectPublicUser(profileResponse.body);
  });

  it('requires authentication for discovery and external profiles', async () => {
    const user = await createUser();

    const listResponse = await request(app).get('/api/users/allUsers');
    const profileResponse = await request(app).get(`/api/users/${user.id}`);

    for (const response of [listResponse, profileResponse]) {
      expect(response.status).toBe(401);
      expect(response.headers['www-authenticate']).toBe('Bearer');
      expect(response.body).toEqual({ error: 'Authentication required.' });
    }
  });

  it('does not expose path-based user mutation or account deletion routes', async () => {
    const actingUser = await createUser();
    const targetUser = await createUser();
    const token = createToken(actingUser);

    const updateResponse = await request(app)
      .patch(`/api/users/${targetUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Changed' });
    const deleteResponse = await request(app)
      .delete(`/api/users/${targetUser.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(updateResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);
    await expect(User.findById(actingUser.id)).resolves.not.toBeNull();
    await expect(User.findById(targetUser.id)).resolves.toMatchObject({ firstName: 'Test' });
  });

  it('does not expose the legacy proofless password-reset route', async () => {
    const originalPassword = await bcrypt.hash('original-password', 4);
    const user = await createUser({ password: originalPassword });
    const response = await request(app).post('/api/users/changePassword').send({
      email: user.email,
      newPassword: 'new-test-password',
      confirmNewPassword: 'new-test-password',
    });

    expect(response.status).toBe(404);
    const unchangedUser = await User.findById(user.id).select('+password');
    expect(unchangedUser?.password).toBe(originalPassword);
  });

  it('returns public representations for friends and friend deletion', async () => {
    const user = await createUser();
    const removedFriend = await createUser();
    const remainingFriend = await createUser();
    user.friends = [removedFriend.id, remainingFriend.id];
    removedFriend.friends = [user.id];
    await Promise.all([user.save(), removedFriend.save()]);
    const token = createToken(user);
    const listResponse = await request(app)
      .get('/api/users/friends')
      .set('Authorization', `Bearer ${token}`);
    const deleteResponse = await request(app)
      .delete(`/api/users/friends/${removedFriend.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(2);
    listResponse.body.forEach(expectPublicUser);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.friends).toHaveLength(1);
    expectPublicUser(deleteResponse.body.friends[0]);
  });

  it('returns public representations for incoming and outgoing requests', async () => {
    const user = await createUser();
    const incoming = await createUser();
    const outgoing = await createUser();
    user.receivedFriendRequests = [incoming.id];
    user.sentFriendRequests = [outgoing.id];
    await user.save();
    const token = createToken(user);
    const incomingResponse = await request(app)
      .get('/api/users/friendRequest')
      .set('Authorization', `Bearer ${token}`);
    const outgoingResponse = await request(app)
      .get('/api/users/friendRequest/sent')
      .set('Authorization', `Bearer ${token}`);

    expect(incomingResponse.status).toBe(200);
    expect(incomingResponse.body).toHaveLength(1);
    expectPublicUser(incomingResponse.body[0]);
    expect(outgoingResponse.status).toBe(200);
    expect(outgoingResponse.body).toHaveLength(1);
    expectPublicUser(outgoingResponse.body[0]);
  });

  it('returns public representations after accepting a request', async () => {
    const user = await createUser();
    const accepted = await createUser();
    const remaining = await createUser();
    user.receivedFriendRequests = [accepted.id, remaining.id];
    accepted.sentFriendRequests = [user.id];
    await Promise.all([user.save(), accepted.save()]);
    const response = await request(app)
      .post(`/api/users/friends/accept/${accepted.id}`)
      .set('Authorization', `Bearer ${createToken(user)}`);

    expect(response.status).toBe(200);
    expect(response.body.updatedFriendRequests).toHaveLength(1);
    expectPublicUser(response.body.updatedFriendRequests[0]);
  });

  it('returns public representations after rejecting a request', async () => {
    const user = await createUser();
    const rejected = await createUser();
    const remaining = await createUser();
    user.receivedFriendRequests = [rejected.id, remaining.id];
    rejected.sentFriendRequests = [user.id];
    await Promise.all([user.save(), rejected.save()]);
    const response = await request(app)
      .post(`/api/users/friends/reject/${rejected.id}`)
      .set('Authorization', `Bearer ${createToken(user)}`);

    expect(response.status).toBe(200);
    expect(response.body.updatedFriendRequests).toHaveLength(1);
    expectPublicUser(response.body.updatedFriendRequests[0]);
  });

  it('returns public representations after cancelling a request', async () => {
    const user = await createUser();
    const cancelled = await createUser();
    const remaining = await createUser();
    user.sentFriendRequests = [cancelled.id, remaining.id];
    cancelled.receivedFriendRequests = [user.id];
    await Promise.all([user.save(), cancelled.save()]);
    const response = await request(app)
      .delete(`/api/users/friendRequest/sent/${cancelled.id}`)
      .set('Authorization', `Bearer ${createToken(user)}`);

    expect(response.status).toBe(200);
    expect(response.body.updatedSendFriendRequests).toHaveLength(1);
    expectPublicUser(response.body.updatedSendFriendRequests[0]);
  });

  it('returns private representations after deleting one or all hobbies', async () => {
    const oneHobbyUser = await createUser({ hobbies: ['reading', 'running'] });
    const oneHobbyResponse = await request(app)
      .delete('/api/hobbies/userHobbies/running')
      .set('Authorization', `Bearer ${createToken(oneHobbyUser)}`);
    const allHobbiesUser = await createUser({ hobbies: ['reading'] });
    const allHobbiesResponse = await request(app)
      .delete('/api/hobbies/userHobbies')
      .set('Authorization', `Bearer ${createToken(allHobbiesUser)}`);

    expect(oneHobbyResponse.status).toBe(200);
    expectPrivateUser(oneHobbyResponse.body);
    expect(oneHobbyResponse.body.hobbies).toEqual(['reading']);
    expect(allHobbiesResponse.status).toBe(200);
    expectPrivateUser(allHobbiesResponse.body);
    expect(allHobbiesResponse.body.hobbies).toEqual([]);
  });
});
