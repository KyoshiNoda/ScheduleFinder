import mongoose from 'mongoose';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { signAccessToken } from '../auth/accessToken';
import Schedule from '../models/scheduleModel';
import User from '../models/userModel';

const app = createApp();
let userSequence = 0;

const createUser = async () => {
  userSequence += 1;

  return User.create({
    firstName: 'Schedule',
    lastName: `Tester ${userSequence}`,
    email: `schedule-tester-${userSequence}@example.invalid`,
    password: 'synthetic-password-hash',
    birthday: new Date('2000-01-01T00:00:00.000Z'),
    school: 'Test University',
    photoURL: 'local-default-profile.png',
  });
};

const createSchedule = (userId: string, visibility: string = 'public') =>
  Schedule.create({ user_id: userId, visibility, timeSlots: [] });

const timeSlotInput = {
  title: 'Algorithms',
  startTime: '10:00 AM',
  endTime: '11:00 AM',
  color: 'blue',
  days: {
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
};

describe('schedule access control', () => {
  it('requires authentication for schedule reads and mutations', async () => {
    const owner = await createUser();
    const schedule = await createSchedule(owner.id);

    const responses = await Promise.all([
      request(app).get('/api/schedules/mySchedule'),
      request(app).get(`/api/schedules/${owner.id}/user`),
      request(app).get(`/api/schedules/${schedule.id}`),
      request(app).post(`/api/schedules/${schedule.id}`).send(timeSlotInput),
      request(app).post('/api/schedules').send({ user_id: owner.id }),
    ]);

    responses.forEach((response) => {
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Authentication required.' });
    });
  });

  it('allows members to read public schedules but protects private schedules', async () => {
    const publicOwner = await createUser();
    const privateOwner = await createUser();
    const viewer = await createUser();
    const publicSchedule = await createSchedule(publicOwner.id);
    const privateSchedule = await createSchedule(privateOwner.id, 'private');
    const viewerToken = signAccessToken(viewer.id);
    const privateOwnerToken = signAccessToken(privateOwner.id);

    const publicResponse = await request(app)
      .get(`/api/schedules/${publicOwner.id}/user`)
      .set('Authorization', `Bearer ${viewerToken}`);
    const privateResponse = await request(app)
      .get(`/api/schedules/${privateOwner.id}/user`)
      .set('Authorization', `Bearer ${viewerToken}`);
    const ownerResponse = await request(app)
      .get(`/api/schedules/${privateOwner.id}/user`)
      .set('Authorization', `Bearer ${privateOwnerToken}`);
    const scheduleIdResponse = await request(app)
      .get(`/api/schedules/${publicSchedule.id}`)
      .set('Authorization', `Bearer ${viewerToken}`);

    expect(publicResponse.status).toBe(200);
    expect(publicResponse.body._id).toBe(publicSchedule.id);
    expect(privateResponse.status).toBe(403);
    expect(privateResponse.body).toEqual({ error: 'Forbidden' });
    expect(ownerResponse.status).toBe(200);
    expect(ownerResponse.body._id).toBe(privateSchedule.id);
    expect(scheduleIdResponse.status).toBe(403);
  });

  it('rejects every attempt to mutate another user\'s schedule', async () => {
    const owner = await createUser();
    const otherUser = await createUser();
    const timeSlotId = new mongoose.Types.ObjectId();
    const schedule = await Schedule.create({
      user_id: owner.id,
      visibility: 'public',
      timeSlots: [{ _id: timeSlotId, ...timeSlotInput }],
    });
    const otherToken = signAccessToken(otherUser.id);

    const responses = await Promise.all([
      request(app)
        .post(`/api/schedules/${schedule.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send(timeSlotInput),
      request(app)
        .patch(`/api/schedules/${schedule.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ visibility: 'private' }),
      request(app)
        .patch(`/api/schedules/${schedule.id}/timeSlot`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ _id: timeSlotId.toString(), title: 'Changed' }),
      request(app)
        .delete(`/api/schedules/${schedule.id}`)
        .set('Authorization', `Bearer ${otherToken}`),
      request(app)
        .delete(`/api/schedules/${schedule.id}/timeSlot`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ _id: timeSlotId.toString() }),
    ]);

    responses.forEach((response) => {
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Forbidden' });
    });

    const unchangedSchedule = await Schedule.findById(schedule.id);
    expect(unchangedSchedule).toMatchObject({
      user_id: owner.id,
      visibility: 'public',
    });
    expect(unchangedSchedule?.timeSlots).toHaveLength(1);
    expect(unchangedSchedule?.timeSlots[0].title).toBe('Algorithms');
  });

  it('derives schedule creation and mutation ownership from the token', async () => {
    const owner = await createUser();
    const otherUser = await createUser();
    const ownerToken = signAccessToken(owner.id);

    const createResponse = await request(app)
      .post('/api/schedules')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({});

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.user_id).toBe(owner.id);
    expect(createResponse.body.visibility).toBe('public');

    const insertResponse = await request(app)
      .post(`/api/schedules/${createResponse.body._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(timeSlotInput);
    const updateResponse = await request(app)
      .patch(`/api/schedules/${createResponse.body._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ visibility: 'private' });
    const updateTimeSlotResponse = await request(app)
      .patch(`/api/schedules/${createResponse.body._id}/timeSlot`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ _id: insertResponse.body._id, title: 'Advanced Algorithms' });
    const secondInsertResponse = await request(app)
      .post(`/api/schedules/${createResponse.body._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        ...timeSlotInput,
        title: 'Databases',
        startTime: '11:00 AM',
        endTime: '12:00 PM',
      });
    const deleteTimeSlotResponse = await request(app)
      .delete(`/api/schedules/${createResponse.body._id}/timeSlot`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ _id: insertResponse.body._id });
    const clearResponse = await request(app)
      .delete(`/api/schedules/${createResponse.body._id}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(insertResponse.status).toBe(200);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.user_id).toBe(owner.id);
    expect(updateResponse.body.visibility).toBe('private');
    expect(updateResponse.body.timeSlots).toHaveLength(1);
    expect(updateTimeSlotResponse.status).toBe(200);
    expect(updateTimeSlotResponse.body.title).toBe('Advanced Algorithms');
    expect(secondInsertResponse.status).toBe(200);
    expect(deleteTimeSlotResponse.status).toBe(200);
    expect(deleteTimeSlotResponse.body._id).toBe(insertResponse.body._id);
    expect(clearResponse.status).toBe(200);
    expect(clearResponse.body.timeSlots).toEqual([]);
  });

  it('removes the collection-wide schedule read', async () => {
    const user = await createUser();
    const response = await request(app)
      .get('/api/schedules')
      .set('Authorization', `Bearer ${signAccessToken(user.id)}`);

    expect(response.status).toBe(404);
  });
});
