import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { signAccessToken } from '../auth/accessToken';
import { createApp } from '../app';
import User from '../models/userModel';

const app = createApp();
const originalAccessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRES_IN;
let userSequence = 0;

const getAccessTokenSecret = (): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is required for integration tests');
  }

  return secret;
};

const createUser = async (password: string = 'synthetic-password-hash') => {
  userSequence += 1;

  return User.create({
    firstName: 'Token',
    lastName: `Tester ${userSequence}`,
    email: `token-tester-${userSequence}@example.invalid`,
    password,
    birthday: new Date('2000-01-01T00:00:00.000Z'),
    school: 'Test University',
    photoURL: 'local-default-profile.png',
  });
};

const expectMinimalClaims = (token: string, userId: string, lifetimeSeconds: number) => {
  const decoded = jwt.decode(token);

  expect(decoded).not.toBeNull();
  expect(typeof decoded).not.toBe('string');

  const claims = decoded as JwtPayload;
  expect(Object.keys(claims).sort()).toEqual(['exp', 'iat', 'sub']);
  expect(claims.sub).toBe(userId);
  expect(claims.iat).toEqual(expect.any(Number));
  expect(claims.exp).toEqual(expect.any(Number));
  expect(claims.exp! - claims.iat!).toBe(lifetimeSeconds);
};

const expectAuthenticationFailure = (response: request.Response, submittedToken?: string) => {
  expect(response.status).toBe(401);
  expect(response.headers['www-authenticate']).toBe('Bearer');
  expect(response.body).toEqual({ error: 'Authentication required.' });

  if (submittedToken) {
    expect(response.text).not.toContain(submittedToken);
  }
};

beforeEach(() => {
  delete process.env.ACCESS_TOKEN_EXPIRES_IN;
});

afterEach(() => {
  if (originalAccessTokenExpiry === undefined) {
    delete process.env.ACCESS_TOKEN_EXPIRES_IN;
  } else {
    process.env.ACCESS_TOKEN_EXPIRES_IN = originalAccessTokenExpiry;
  }
});

describe('minimal access tokens', () => {
  it('issues only standard identity and expiry claims from registration and login', async () => {
    const registrationResponse = await request(app).post('/api/auth/register').send({
      firstName: 'Registered',
      lastName: 'Student',
      email: 'registered-token-user@example.invalid',
      password: 'test-password',
      school: 'Test University',
      birthday: '2000-01-01T00:00:00.000Z',
    });

    expect(registrationResponse.status).toBe(200);
    expectMinimalClaims(
      registrationResponse.body.token,
      registrationResponse.body.user._id,
      24 * 60 * 60
    );

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'registered-token-user@example.invalid',
      password: 'test-password',
    });

    expect(loginResponse.status).toBe(200);
    expectMinimalClaims(loginResponse.body.token, loginResponse.body.user._id, 24 * 60 * 60);
  });

  it('uses the configured access-token lifetime', async () => {
    process.env.ACCESS_TOKEN_EXPIRES_IN = '5m';
    const user = await createUser();

    expectMinimalClaims(signAccessToken(user.id), user.id, 5 * 60);
  });

  it('rejects an invalid access-token lifetime', async () => {
    process.env.ACCESS_TOKEN_EXPIRES_IN = 'tomorrow';
    const user = await createUser();

    expect(() => signAccessToken(user.id)).toThrow(
      'ACCESS_TOKEN_EXPIRES_IN must be a positive duration'
    );
  });

  it('accepts a valid minimal token on a protected route', async () => {
    const user = await createUser();
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${signAccessToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(user.id);
  });

  it('accepts a case-insensitive Bearer scheme with separating whitespace', async () => {
    const user = await createUser();
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `bEaReR   ${signAccessToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(user.id);
  });

  it.each([
    ['missing header', undefined],
    ['empty header', ''],
    ['wrong scheme', 'Basic credentials'],
    ['missing Bearer credentials', 'Bearer'],
    ['extra Bearer fields', 'Bearer not-a-jwt extra'],
  ])('returns a generic 401 response for a %s', async (_label, authorizationHeader) => {
    let pendingRequest = request(app).get('/api/users');

    if (authorizationHeader !== undefined) {
      pendingRequest = pendingRequest.set('Authorization', authorizationHeader);
    }

    const response = await pendingRequest;
    expectAuthenticationFailure(response, authorizationHeader);
  });

  it.each([
    ['expired', (user: Awaited<ReturnType<typeof createUser>>) =>
      jwt.sign({}, getAccessTokenSecret(), { subject: user.id, expiresIn: -1 })],
    ['malformed', () => 'not-a-jwt'],
    ['invalid-subject', () =>
      jwt.sign({}, getAccessTokenSecret(), { subject: 'not-an-object-id', expiresIn: '5m' })],
    ['missing-expiry', (user: Awaited<ReturnType<typeof createUser>>) =>
      jwt.sign({}, getAccessTokenSecret(), { subject: user.id })],
    ['unsupported-algorithm', (user: Awaited<ReturnType<typeof createUser>>) =>
      jwt.sign({}, getAccessTokenSecret(), {
        algorithm: 'HS384',
        subject: user.id,
        expiresIn: '5m',
      })],
    ['legacy-full-user', (user: Awaited<ReturnType<typeof createUser>>) =>
      jwt.sign({ data: user.toObject() }, getAccessTokenSecret(), { expiresIn: '5m' })],
  ])('rejects a %s token', async (_label, createToken) => {
    const user = await createUser();
    const token = createToken(user);
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expectAuthenticationFailure(response, token);
  });

  it('checks the current stored password rather than a token snapshot', async () => {
    const user = await createUser(await bcrypt.hash('original-password', 4));
    const token = signAccessToken(user.id);
    user.password = await bcrypt.hash('current-password', 4);
    await user.save();

    const response = await request(app)
      .post('/api/users/changePassword/token')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'current-password',
        newPassword: 'new-password',
        confirmNewPassword: 'new-password',
      });

    expect(response.status).toBe(200);

    const updatedUser = await User.findById(user.id).select('+password');
    expect(updatedUser).not.toBeNull();
    await expect(bcrypt.compare('new-password', updatedUser!.password)).resolves.toBe(true);
    await expect(bcrypt.compare('current-password', updatedUser!.password)).resolves.toBe(false);
  });
});
