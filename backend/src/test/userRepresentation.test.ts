import { describe, expect, it } from 'vitest';
import User from '../models/userModel';
import {
  calculateAge,
  toAuthUser,
  toPrivateUser,
  toPublicUser,
} from '../representations/userRepresentation';

const user = new User({
  firstName: 'Test',
  lastName: 'Student',
  email: 'test.student@example.invalid',
  password: 'synthetic-password-hash',
  birthday: new Date('2000-09-22T00:00:00.000Z'),
  photoURL: undefined,
  school: undefined,
  major: undefined,
  gender: undefined,
  hobbies: undefined,
  friends: ['friend-id'],
  receivedFriendRequests: ['received-id'],
  sentFriendRequests: ['sent-id'],
});

describe('user response representations', () => {
  it('maps a public user to the exact public allowlist', () => {
    expect(toPublicUser(user)).toEqual({
      _id: user.id,
      firstName: 'Test',
      lastName: 'Student',
      photoURL: null,
      age: expect.any(Number),
      school: null,
      major: null,
      gender: null,
      hobbies: [],
    });
  });

  it('maps a private user to the public fields plus email and ISO birthday', () => {
    expect(toPrivateUser(user)).toEqual({
      _id: user.id,
      firstName: 'Test',
      lastName: 'Student',
      photoURL: null,
      age: expect.any(Number),
      school: null,
      major: null,
      gender: null,
      hobbies: [],
      email: 'test.student@example.invalid',
      birthday: '2000-09-22T00:00:00.000Z',
    });
  });

  it('maps an authentication user to the exact session allowlist', () => {
    expect(toAuthUser(user)).toEqual({
      _id: user.id,
      firstName: 'Test',
      lastName: 'Student',
      email: 'test.student@example.invalid',
      photoURL: null,
    });
  });

  it('calculates age on both sides of the birthday boundary', () => {
    const birthday = new Date('2000-09-22T00:00:00.000Z');

    expect(calculateAge(birthday, new Date('2026-09-21T12:00:00.000Z'))).toBe(25);
    expect(calculateAge(birthday, new Date('2026-09-22T00:00:00.000Z'))).toBe(26);
    expect(calculateAge(birthday, new Date('2026-09-23T12:00:00.000Z'))).toBe(26);
  });
});
