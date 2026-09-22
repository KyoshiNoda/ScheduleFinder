import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';
import User from '../models/userModel';

const app = createApp();

describe('GET /api/users', () => {
  it('returns the authenticated user from the isolated test database', async () => {
    const user = await User.create({
      firstName: 'Test',
      lastName: 'Student',
      email: 'test.student@example.invalid',
      password: 'synthetic-password-hash',
      birthday: new Date('2000-01-01T00:00:00.000Z'),
      school: 'Test University',
      photoURL: 'local-default-profile.png',
    });
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessTokenSecret) {
      throw new Error('ACCESS_TOKEN_SECRET is required for integration tests');
    }

    const token = jwt.sign({ data: user.toObject() }, accessTokenSecret, {
      expiresIn: '5m',
    });

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      _id: user.id,
      email: 'test.student@example.invalid',
    });
  });
});
