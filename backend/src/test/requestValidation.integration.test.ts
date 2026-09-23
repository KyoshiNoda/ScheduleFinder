import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request, { Response } from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { signAccessToken } from '../auth/accessToken';
import Hobby from '../models/hobbyModel';
import Schedule from '../models/scheduleModel';
import User from '../models/userModel';

const app = createApp();
let userSequence = 0;

const createUser = async (overrides: Record<string, unknown> = {}) => {
  userSequence += 1;

  return User.create({
    firstName: 'Validation',
    lastName: `Tester ${userSequence}`,
    email: `validation-${userSequence}@example.invalid`,
    password: 'synthetic-password-hash',
    birthday: new Date('2000-01-01T00:00:00.000Z'),
    school: 'Test University',
    photoURL: 'local-default-profile.png',
    ...overrides,
  });
};

const expectValidationError = (response: Response, path?: string) => {
  expect(response.status).toBe(400);
  expect(response.body).toMatchObject({
    error: 'Validation failed.',
    code: 'VALIDATION_ERROR',
    issues: expect.any(Array),
  });

  if (path) {
    expect(response.body.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path })])
    );
  }
};

const days = {
  monday: true,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

const timeSlot = {
  days,
  title: 'Algorithms',
  startTime: '10:00 AM',
  endTime: '11:00 AM',
  color: 'blue',
  location: null,
  professor: null,
};

describe('request validation', () => {
  it('normalizes malformed JSON parser failures', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email":');

    expectValidationError(response, 'body');
    expect(response.body.issues[0].message).toBe('Request body must contain valid JSON.');
  });

  it('uses the normalized error envelope without echoing submitted secrets', async () => {
    const submittedPassword = 'do-not-echo-this-password';
    const response = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'not-an-email',
      password: submittedPassword,
      school: 'Test University',
      birthday: '2000-01-01',
      isAdmin: true,
    });

    expectValidationError(response, 'body.email');
    expect(response.text).not.toContain(submittedPassword);
    expect(response.body.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: 'body' })])
    );
  });

  it('validates authentication payloads and preserves legacy login compatibility', async () => {
    const shortPassword = 'x';
    const user = await createUser({ password: await bcrypt.hash(shortPassword, 4) });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: shortPassword,
    });
    const byteLimitResponse = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'bytes@example.invalid',
      password: 'é'.repeat(40),
      school: 'Test University',
      birthday: '2000-01-01',
    });
    const invalidCodeResponse = await request(app)
      .post('/api/auth/password-reset/verify')
      .send({ email: user.email, code: '12ab56' });

    expect(loginResponse.status).toBe(200);
    expectValidationError(byteLimitResponse, 'body.password');
    expectValidationError(invalidCodeResponse, 'body.code');
  });

  it('rejects unknown or protected user fields and applies only allowlisted updates', async () => {
    const user = await createUser();
    const token = signAccessToken(user.id);
    const protectedFieldResponse = await request(app)
      .patch('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Changed', password: 'replacement-hash' });
    const validResponse = await request(app)
      .patch('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: '  Updated  ', major: '  Computer Science  ' });

    expectValidationError(protectedFieldResponse, 'body');
    expect(validResponse.status).toBe(200);
    expect(validResponse.body).toMatchObject({
      firstName: 'Updated',
      major: 'Computer Science',
    });

    const storedUser = await User.findById(user.id).select('+password');
    expect(storedUser?.password).toBe('synthetic-password-hash');
  });

  it('rejects invalid IDs before user and relationship database lookups', async () => {
    const user = await createUser();
    const token = signAccessToken(user.id);
    const requests = [
      request(app).get('/api/users/not-an-id'),
      request(app).post('/api/users/friendRequest/not-an-id'),
      request(app).delete('/api/users/friendRequest/not-an-id'),
      request(app).delete('/api/users/friendRequest/sent/not-an-id'),
      request(app).delete('/api/users/friends/not-an-id'),
      request(app).post('/api/users/friends/accept/not-an-id'),
      request(app).post('/api/users/friends/reject/not-an-id'),
    ];

    const responses = await Promise.all(
      requests.map((pendingRequest) => pendingRequest.set('Authorization', `Bearer ${token}`))
    );

    responses.forEach((response) => expectValidationError(response));
  });

  it('authenticates protected routes before validating their payloads', async () => {
    const response = await request(app)
      .patch('/api/users')
      .send({ password: 'attempted-update' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Authentication required.' });
  });

  it('strictly validates schedule creation, updates, and identifiers', async () => {
    const user = await createUser();
    const token = signAccessToken(user.id);
    const unknownCreationField = await request(app)
      .post('/api/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: new mongoose.Types.ObjectId().toString() });
    const invalidID = await request(app)
      .get('/api/schedules/not-an-id')
      .set('Authorization', `Bearer ${token}`);
    const schedule = await Schedule.create({
      user_id: user.id,
      visibility: 'public',
      timeSlots: [],
    });
    const unknownUpdateField = await request(app)
      .patch(`/api/schedules/${schedule.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ visibility: 'private', user_id: user.id });

    expectValidationError(unknownCreationField, 'body');
    expectValidationError(invalidID, 'params.id');
    expectValidationError(unknownUpdateField, 'body');

    const unchangedSchedule = await Schedule.findById(schedule.id);
    expect(unchangedSchedule?.visibility).toBe('public');
  });

  it('validates time-slot shape, ordering, overlaps, and adjacent intervals', async () => {
    const user = await createUser();
    const token = signAccessToken(user.id);
    const schedule = await Schedule.create({
      user_id: user.id,
      visibility: 'public',
      timeSlots: [],
    });

    const noSelectedDay = await request(app)
      .post(`/api/schedules/${schedule.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...timeSlot,
        days: Object.fromEntries(Object.keys(days).map((day) => [day, false])),
      });
    const backwards = await request(app)
      .post(`/api/schedules/${schedule.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...timeSlot, startTime: '11:00 AM', endTime: '10:00 AM' });
    const firstInsert = await request(app)
      .post(`/api/schedules/${schedule.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(timeSlot);
    const overlap = await request(app)
      .post(`/api/schedules/${schedule.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...timeSlot, title: 'Overlapping', startTime: '10:30 AM', endTime: '11:30 AM' });
    const adjacent = await request(app)
      .post(`/api/schedules/${schedule.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...timeSlot, title: 'Adjacent', startTime: '11:00 AM', endTime: '12:00 PM' });
    const invalidPartialUpdate = await request(app)
      .patch(`/api/schedules/${schedule.id}/timeSlot`)
      .set('Authorization', `Bearer ${token}`)
      .send({ _id: firstInsert.body._id, endTime: '9:00 AM' });

    expectValidationError(noSelectedDay, 'body.days');
    expectValidationError(backwards, 'body.startTime');
    expect(firstInsert.status).toBe(200);
    expectValidationError(overlap, 'body.startTime');
    expect(adjacent.status).toBe(200);
    expectValidationError(invalidPartialUpdate, 'body.startTime');

    const storedSchedule = await Schedule.findById(schedule.id);
    expect(storedSchedule?.timeSlots).toHaveLength(2);
    expect(storedSchedule?.timeSlots[0].endTime).toBe('11:00 AM');
  });

  it('normalizes hobby names and rejects malformed hobby bodies', async () => {
    const user = await createUser();
    const token = signAccessToken(user.id);
    const validResponse = await request(app)
      .patch('/api/hobbies/userHobbies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '  Rock Climbing  ' });
    const unknownFieldResponse = await request(app)
      .patch('/api/hobbies/userHobbies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Chess', owner: user.id });

    expect(validResponse.status).toBe(200);
    expect(validResponse.body.name).toBe('rock climbing');
    expectValidationError(unknownFieldResponse, 'body');
    await expect(Hobby.findOne({ name: 'rock climbing' })).resolves.not.toBeNull();
  });
});
