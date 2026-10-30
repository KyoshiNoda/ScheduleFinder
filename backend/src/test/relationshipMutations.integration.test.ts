import mongoose from 'mongoose';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendGridMocks = vi.hoisted(() => ({
  send: vi.fn(),
  setApiKey: vi.fn(),
}));

vi.mock('@sendgrid/mail', () => ({
  default: {
    send: sendGridMocks.send,
    setApiKey: sendGridMocks.setApiKey,
  },
}));

import { createApp } from '../app';
import { signAccessToken } from '../auth/accessToken';
import User from '../models/userModel';

const app = createApp();
let userSequence = 0;

const createUser = async () => {
  userSequence += 1;

  return User.create({
    firstName: 'Relationship',
    lastName: `Tester ${userSequence}`,
    email: `relationship-${userSequence}@example.invalid`,
    password: 'synthetic-password-hash',
    birthday: new Date('2000-01-01T00:00:00.000Z'),
    school: 'Test University',
    photoURL: 'local-default-profile.png',
  });
};

const authenticated = (method: 'post' | 'delete', path: string, userId: string) =>
  request(app)[method](path).set('Authorization', `Bearer ${signAccessToken(userId)}`);

const sendRequest = (actorId: string, targetId: string) =>
  authenticated('post', `/api/users/friendRequest/${targetId}`, actorId);

const acceptRequest = (actorId: string, targetId: string) =>
  authenticated('post', `/api/users/friends/accept/${targetId}`, actorId);

const rejectRequest = (actorId: string, targetId: string) =>
  authenticated('post', `/api/users/friends/reject/${targetId}`, actorId);

const removeReceivedRequest = (actorId: string, targetId: string) =>
  authenticated('delete', `/api/users/friendRequest/${targetId}`, actorId);

const cancelRequest = (actorId: string, targetId: string) =>
  authenticated('delete', `/api/users/friendRequest/sent/${targetId}`, actorId);

const unfriend = (actorId: string, targetId: string) =>
  authenticated('delete', `/api/users/friends/${targetId}`, actorId);

const loadPair = async (firstId: string, secondId: string) => {
  const [first, second] = await Promise.all([
    User.findById(firstId).orFail(),
    User.findById(secondId).orFail(),
  ]);

  return { first, second };
};

const expectNoPairEntries = (
  user: { friends: string[]; receivedFriendRequests: string[]; sentFriendRequests: string[] },
  otherId: string
) => {
  expect(user.friends).not.toContain(otherId);
  expect(user.receivedFriendRequests).not.toContain(otherId);
  expect(user.sentFriendRequests).not.toContain(otherId);
};

beforeEach(() => {
  sendGridMocks.send.mockReset();
  sendGridMocks.send.mockResolvedValue([{ statusCode: 202 }]);
});

describe('relationship mutations', () => {
  it('rejects self-relationships, missing users, and acceptance without a request', async () => {
    const actor = await createUser();
    const missingId = new mongoose.Types.ObjectId().toString();

    const selfResponse = await sendRequest(actor.id, actor.id);
    const missingResponse = await sendRequest(actor.id, missingId);
    const target = await createUser();
    const missingRequestResponse = await acceptRequest(actor.id, target.id);

    expect(selfResponse.status).toBe(400);
    expect(selfResponse.body.code).toBe('SELF_RELATIONSHIP');
    expect(missingResponse.status).toBe(404);
    expect(missingResponse.body.code).toBe('RELATIONSHIP_USER_NOT_FOUND');
    expect(missingRequestResponse.status).toBe(409);
    expect(missingRequestResponse.body.code).toBe('RELATIONSHIP_CONFLICT');
    expect(sendGridMocks.send).not.toHaveBeenCalled();
  });

  it('creates one mirrored request and makes duplicate sends idempotent', async () => {
    const actor = await createUser();
    const target = await createUser();

    const firstResponse = await sendRequest(actor.id, target.id);
    await User.updateOne(
      { _id: actor.id },
      { $set: { sentFriendRequests: [target.id, target.id] } }
    );
    await User.updateOne(
      { _id: target.id },
      { $set: { receivedFriendRequests: [] } }
    );
    const retryResponse = await sendRequest(actor.id, target.id);
    const pair = await loadPair(actor.id, target.id);

    expect(firstResponse.status).toBe(200);
    expect(retryResponse.status).toBe(200);
    expect(pair.first.sentFriendRequests).toEqual([target.id]);
    expect(pair.second.receivedFriendRequests).toEqual([actor.id]);
    expectNoPairEntries(
      {
        friends: pair.first.friends,
        receivedFriendRequests: pair.first.receivedFriendRequests,
        sentFriendRequests: [],
      },
      target.id
    );
    expect(pair.second.friends).not.toContain(actor.id);
    expect(pair.second.sentFriendRequests).not.toContain(actor.id);
    expect(sendGridMocks.send).toHaveBeenCalledTimes(1);
  });

  it('auto-accepts a reciprocal request and does not send another notification', async () => {
    const first = await createUser();
    const second = await createUser();

    expect((await sendRequest(first.id, second.id)).status).toBe(200);
    expect((await sendRequest(second.id, first.id)).status).toBe(200);

    const pair = await loadPair(first.id, second.id);
    expect(pair.first.friends).toEqual([second.id]);
    expect(pair.second.friends).toEqual([first.id]);
    expectNoPairEntries(
      {
        friends: [],
        receivedFriendRequests: pair.first.receivedFriendRequests,
        sentFriendRequests: pair.first.sentFriendRequests,
      },
      second.id
    );
    expectNoPairEntries(
      {
        friends: [],
        receivedFriendRequests: pair.second.receivedFriendRequests,
        sentFriendRequests: pair.second.sentFriendRequests,
      },
      first.id
    );
    expect(sendGridMocks.send).toHaveBeenCalledTimes(1);
  });

  it('repairs a duplicated one-sided request when accepting and makes acceptance retry-safe', async () => {
    const actor = await createUser();
    const requester = await createUser();
    await User.updateOne(
      { _id: actor.id },
      { $set: { receivedFriendRequests: [requester.id, requester.id] } }
    );

    const firstResponse = await acceptRequest(actor.id, requester.id);
    await User.updateOne(
      { _id: actor.id },
      { $set: { friends: [requester.id, requester.id] } }
    );
    await User.updateOne(
      { _id: requester.id },
      { $set: { friends: [] } }
    );
    const retryResponse = await acceptRequest(actor.id, requester.id);
    const pair = await loadPair(actor.id, requester.id);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body.updatedFriendRequests).toEqual([]);
    expect(retryResponse.status).toBe(200);
    expect(pair.first.friends).toEqual([requester.id]);
    expect(pair.second.friends).toEqual([actor.id]);
    expectNoPairEntries(
      {
        friends: [],
        receivedFriendRequests: pair.first.receivedFriendRequests,
        sentFriendRequests: pair.first.sentFriendRequests,
      },
      requester.id
    );
    expectNoPairEntries(
      {
        friends: [],
        receivedFriendRequests: pair.second.receivedFriendRequests,
        sentFriendRequests: pair.second.sentFriendRequests,
      },
      actor.id
    );
  });

  it('rejects and cancels the applicable direction while preserving the opposite request', async () => {
    const actor = await createUser();
    const target = await createUser();
    await User.updateOne(
      { _id: actor.id },
      {
        $set: {
          receivedFriendRequests: [target.id, target.id],
          sentFriendRequests: [target.id, target.id],
        },
      }
    );
    await User.updateOne(
      { _id: target.id },
      {
        $set: {
          receivedFriendRequests: [actor.id],
          sentFriendRequests: [actor.id],
        },
      }
    );

    const rejectResponse = await rejectRequest(actor.id, target.id);
    const rejectRetry = await removeReceivedRequest(actor.id, target.id);
    let pair = await loadPair(actor.id, target.id);

    expect(rejectResponse.status).toBe(200);
    expect(rejectResponse.body.updatedFriendRequests).toEqual([]);
    expect(rejectRetry.status).toBe(200);
    expect(pair.first.receivedFriendRequests).not.toContain(target.id);
    expect(pair.second.sentFriendRequests).not.toContain(actor.id);
    expect(pair.first.sentFriendRequests).toEqual([target.id]);
    expect(pair.second.receivedFriendRequests).toEqual([actor.id]);

    const cancelResponse = await cancelRequest(actor.id, target.id);
    const cancelRetry = await cancelRequest(actor.id, target.id);
    pair = await loadPair(actor.id, target.id);

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.updatedSendFriendRequests).toEqual([]);
    expect(cancelRetry.status).toBe(200);
    expectNoPairEntries(pair.first, target.id);
    expectNoPairEntries(pair.second, actor.id);
  });

  it('repairs and removes a one-sided duplicated friendship, then tolerates retry', async () => {
    const actor = await createUser();
    const target = await createUser();
    await User.updateOne(
      { _id: actor.id },
      {
        $set: {
          friends: [target.id, target.id],
          sentFriendRequests: [target.id],
        },
      }
    );
    await User.updateOne(
      { _id: target.id },
      { $set: { receivedFriendRequests: [actor.id] } }
    );

    const firstResponse = await unfriend(actor.id, target.id);
    const retryResponse = await unfriend(actor.id, target.id);
    const pair = await loadPair(actor.id, target.id);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body.friends).toEqual([]);
    expect(retryResponse.status).toBe(200);
    expectNoPairEntries(pair.first, target.id);
    expectNoPairEntries(pair.second, actor.id);

    await User.updateOne(
      { _id: actor.id },
      { $set: { sentFriendRequests: [target.id, target.id] } }
    );
    await User.updateOne(
      { _id: target.id },
      { $set: { receivedFriendRequests: [actor.id] } }
    );

    const unrelatedUnfriendResponse = await unfriend(actor.id, target.id);
    const pendingPair = await loadPair(actor.id, target.id);

    expect(unrelatedUnfriendResponse.status).toBe(200);
    expect(pendingPair.first.sentFriendRequests).toEqual([target.id]);
    expect(pendingPair.second.receivedFriendRequests).toEqual([actor.id]);
  });

  it('serializes concurrent duplicate and reciprocal sends into consistent states', async () => {
    const duplicateActor = await createUser();
    const duplicateTarget = await createUser();

    const duplicateResponses = await Promise.all([
      sendRequest(duplicateActor.id, duplicateTarget.id),
      sendRequest(duplicateActor.id, duplicateTarget.id),
    ]);
    const duplicatePair = await loadPair(duplicateActor.id, duplicateTarget.id);

    expect(duplicateResponses.map((response) => response.status)).toEqual([200, 200]);
    expect(duplicatePair.first.sentFriendRequests).toEqual([duplicateTarget.id]);
    expect(duplicatePair.second.receivedFriendRequests).toEqual([duplicateActor.id]);
    expect(sendGridMocks.send).toHaveBeenCalledTimes(1);

    sendGridMocks.send.mockClear();
    const reciprocalFirst = await createUser();
    const reciprocalSecond = await createUser();
    const reciprocalResponses = await Promise.all([
      sendRequest(reciprocalFirst.id, reciprocalSecond.id),
      sendRequest(reciprocalSecond.id, reciprocalFirst.id),
    ]);
    const reciprocalPair = await loadPair(reciprocalFirst.id, reciprocalSecond.id);

    expect(reciprocalResponses.map((response) => response.status)).toEqual([200, 200]);
    expect(reciprocalPair.first.friends).toEqual([reciprocalSecond.id]);
    expect(reciprocalPair.second.friends).toEqual([reciprocalFirst.id]);
    expectNoPairEntries(
      {
        friends: [],
        receivedFriendRequests: reciprocalPair.first.receivedFriendRequests,
        sentFriendRequests: reciprocalPair.first.sentFriendRequests,
      },
      reciprocalSecond.id
    );
    expectNoPairEntries(
      {
        friends: [],
        receivedFriendRequests: reciprocalPair.second.receivedFriendRequests,
        sentFriendRequests: reciprocalPair.second.sentFriendRequests,
      },
      reciprocalFirst.id
    );
    expect(sendGridMocks.send).toHaveBeenCalledTimes(1);
  });

  it('rolls back the first user update when the second transactional update fails', async () => {
    const actor = await createUser();
    const target = await createUser();
    const originalUpdateOne = User.updateOne.bind(User);
    let updateCount = 0;
    const updateSpy = vi.spyOn(User, 'updateOne').mockImplementation(((...args: any[]) => {
      updateCount += 1;
      if (updateCount === 2) {
        throw new Error('Synthetic second-write failure');
      }
      return originalUpdateOne(...args);
    }) as typeof User.updateOne);

    try {
      const response = await sendRequest(actor.id, target.id);
      const pair = await loadPair(actor.id, target.id);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Unable to update relationship.' });
      expectNoPairEntries(pair.first, target.id);
      expectNoPairEntries(pair.second, actor.id);
      expect(sendGridMocks.send).not.toHaveBeenCalled();
    } finally {
      updateSpy.mockRestore();
    }
  });

  it('keeps a committed request successful when the mocked email provider fails', async () => {
    const actor = await createUser();
    const target = await createUser();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    sendGridMocks.send.mockRejectedValueOnce(new Error('Synthetic provider failure'));

    try {
      const response = await sendRequest(actor.id, target.id);
      const pair = await loadPair(actor.id, target.id);

      expect(response.status).toBe(200);
      expect(pair.first.sentFriendRequests).toEqual([target.id]);
      expect(pair.second.receivedFriendRequests).toEqual([actor.id]);
      expect(sendGridMocks.send).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        'Unable to send friend-request notification after the request committed.'
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
