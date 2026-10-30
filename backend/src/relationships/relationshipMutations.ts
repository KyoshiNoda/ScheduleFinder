import mongoose, { PipelineStage } from 'mongoose';
import User, { IUser } from '../models/userModel';

export type RelationshipOperation = 'send' | 'accept' | 'reject' | 'cancel' | 'unfriend';

export type RelationshipOutcome =
  | 'request-created'
  | 'request-exists'
  | 'friendship-created'
  | 'friendship-exists'
  | 'request-rejected'
  | 'request-cancelled'
  | 'friendship-removed'
  | 'no-change';

export interface FriendRequestNotification {
  recipientEmail: string;
  senderFirstName: string;
  senderLastName: string;
}

export interface RelationshipMutationResult {
  outcome: RelationshipOutcome;
  actorRelationships: {
    friends: string[];
    receivedFriendRequests: string[];
    sentFriendRequests: string[];
  };
  notification?: FriendRequestNotification;
}

export type RelationshipErrorCode =
  | 'SELF_RELATIONSHIP'
  | 'RELATIONSHIP_USER_NOT_FOUND'
  | 'RELATIONSHIP_CONFLICT';

export class RelationshipMutationError extends Error {
  public readonly status: number;
  public readonly code: RelationshipErrorCode;

  constructor(status: number, code: RelationshipErrorCode, message: string) {
    super(message);
    this.name = 'RelationshipMutationError';
    this.status = status;
    this.code = code;
  }
}

interface PairState {
  friends: boolean;
  outgoing: boolean;
  incoming: boolean;
}

interface Transition {
  state: PairState;
  outcome: RelationshipOutcome;
  notify: boolean;
}

const contains = (values: string[] | undefined, id: string): boolean =>
  values?.includes(id) ?? false;

const getPairState = (actor: IUser, target: IUser): PairState => ({
  friends: contains(actor.friends, target.id) || contains(target.friends, actor.id),
  outgoing:
    contains(actor.sentFriendRequests, target.id) ||
    contains(target.receivedFriendRequests, actor.id),
  incoming:
    contains(actor.receivedFriendRequests, target.id) ||
    contains(target.sentFriendRequests, actor.id),
});

const resolveTransition = (
  operation: RelationshipOperation,
  current: PairState
): Transition => {
  if (current.friends) {
    return {
      state: operation === 'unfriend'
        ? { friends: false, outgoing: false, incoming: false }
        : { friends: true, outgoing: false, incoming: false },
      outcome: operation === 'unfriend' ? 'friendship-removed' : 'friendship-exists',
      notify: false,
    };
  }

  switch (operation) {
    case 'send':
      if (current.incoming) {
        return {
          state: { friends: true, outgoing: false, incoming: false },
          outcome: 'friendship-created',
          notify: false,
        };
      }

      return {
        state: { friends: false, outgoing: true, incoming: false },
        outcome: current.outgoing ? 'request-exists' : 'request-created',
        notify: !current.outgoing,
      };
    case 'accept':
      if (!current.incoming) {
        throw new RelationshipMutationError(
          409,
          'RELATIONSHIP_CONFLICT',
          'No incoming friend request exists.'
        );
      }

      return {
        state: { friends: true, outgoing: false, incoming: false },
        outcome: 'friendship-created',
        notify: false,
      };
    case 'reject':
      return {
        state: { friends: false, outgoing: current.outgoing, incoming: false },
        outcome: current.incoming ? 'request-rejected' : 'no-change',
        notify: false,
      };
    case 'cancel':
      return {
        state: { friends: false, outgoing: false, incoming: current.incoming },
        outcome: current.outgoing ? 'request-cancelled' : 'no-change',
        notify: false,
      };
    case 'unfriend':
      return {
        state: current,
        outcome: 'no-change',
        notify: false,
      };
  }
};

type RelationshipArrayField =
  | 'friends'
  | 'receivedFriendRequests'
  | 'sentFriendRequests';

const arrayWithout = (field: RelationshipArrayField, otherUserId: string) => ({
  $filter: {
    input: { $ifNull: [`$${field}`, []] },
    as: 'relationshipId',
    cond: { $ne: ['$$relationshipId', otherUserId] },
  },
});

const normalizedArray = (
  field: RelationshipArrayField,
  otherUserId: string,
  include: boolean
) => {
  const withoutOtherUser = arrayWithout(field, otherUserId);

  return include
    ? { $concatArrays: [withoutOtherUser, [otherUserId]] }
    : withoutOtherUser;
};

const createUserUpdate = (
  otherUserId: string,
  state: { friends: boolean; receivedFriendRequests: boolean; sentFriendRequests: boolean }
): PipelineStage[] => [
  {
    $set: {
      friends: normalizedArray('friends', otherUserId, state.friends),
      receivedFriendRequests: normalizedArray(
        'receivedFriendRequests',
        otherUserId,
        state.receivedFriendRequests
      ),
      sentFriendRequests: normalizedArray(
        'sentFriendRequests',
        otherUserId,
        state.sentFriendRequests
      ),
    },
  },
];

const normalizeLocalArray = (values: string[], otherUserId: string, include: boolean): string[] => {
  const withoutOtherUser = values.filter((value) => value !== otherUserId);
  return include ? [...withoutOtherUser, otherUserId] : withoutOtherUser;
};

const getActorRelationships = (
  actor: IUser,
  targetId: string,
  state: PairState
): RelationshipMutationResult['actorRelationships'] => ({
  friends: normalizeLocalArray(actor.friends, targetId, state.friends),
  receivedFriendRequests: normalizeLocalArray(
    actor.receivedFriendRequests,
    targetId,
    state.incoming
  ),
  sentFriendRequests: normalizeLocalArray(actor.sentFriendRequests, targetId, state.outgoing),
});

export const mutateRelationship = async (
  actorId: string,
  targetId: string,
  operation: RelationshipOperation
): Promise<RelationshipMutationResult> => {
  if (actorId === targetId) {
    throw new RelationshipMutationError(
      400,
      'SELF_RELATIONSHIP',
      'A user cannot create a relationship with themselves.'
    );
  }

  const session = await mongoose.startSession();
  let committedResult: RelationshipMutationResult | undefined;

  try {
    await session.withTransaction(async () => {
      const users = await User.find({ _id: { $in: [actorId, targetId] } })
        .session(session)
        .exec();
      const actor = users.find((user) => user.id === actorId);
      const target = users.find((user) => user.id === targetId);

      if (!actor || !target) {
        throw new RelationshipMutationError(
          404,
          'RELATIONSHIP_USER_NOT_FOUND',
          'One of the users does not exist.'
        );
      }

      const transition = resolveTransition(operation, getPairState(actor, target));
      const actorUpdate = createUserUpdate(targetId, {
        friends: transition.state.friends,
        receivedFriendRequests: transition.state.incoming,
        sentFriendRequests: transition.state.outgoing,
      });
      const targetUpdate = createUserUpdate(actorId, {
        friends: transition.state.friends,
        receivedFriendRequests: transition.state.outgoing,
        sentFriendRequests: transition.state.incoming,
      });

      await User.updateOne({ _id: actorId }, actorUpdate, { session }).exec();
      await User.updateOne({ _id: targetId }, targetUpdate, { session }).exec();

      committedResult = {
        outcome: transition.outcome,
        actorRelationships: getActorRelationships(actor, targetId, transition.state),
        notification: transition.notify
          ? {
              recipientEmail: target.email,
              senderFirstName: actor.firstName,
              senderLastName: actor.lastName,
            }
          : undefined,
      };
    });
  } finally {
    await session.endSession();
  }

  if (!committedResult) {
    throw new Error('Relationship transaction did not commit.');
  }

  return committedResult;
};
