"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutateRelationship = exports.RelationshipMutationError = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
class RelationshipMutationError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = 'RelationshipMutationError';
        this.status = status;
        this.code = code;
    }
}
exports.RelationshipMutationError = RelationshipMutationError;
const contains = (values, id) => { var _a; return (_a = values === null || values === void 0 ? void 0 : values.includes(id)) !== null && _a !== void 0 ? _a : false; };
const getPairState = (actor, target) => ({
    friends: contains(actor.friends, target.id) || contains(target.friends, actor.id),
    outgoing: contains(actor.sentFriendRequests, target.id) ||
        contains(target.receivedFriendRequests, actor.id),
    incoming: contains(actor.receivedFriendRequests, target.id) ||
        contains(target.sentFriendRequests, actor.id),
});
const resolveTransition = (operation, current) => {
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
                throw new RelationshipMutationError(409, 'RELATIONSHIP_CONFLICT', 'No incoming friend request exists.');
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
const arrayWithout = (field, otherUserId) => ({
    $filter: {
        input: { $ifNull: [`$${field}`, []] },
        as: 'relationshipId',
        cond: { $ne: ['$$relationshipId', otherUserId] },
    },
});
const normalizedArray = (field, otherUserId, include) => {
    const withoutOtherUser = arrayWithout(field, otherUserId);
    return include
        ? { $concatArrays: [withoutOtherUser, [otherUserId]] }
        : withoutOtherUser;
};
const createUserUpdate = (otherUserId, state) => [
    {
        $set: {
            friends: normalizedArray('friends', otherUserId, state.friends),
            receivedFriendRequests: normalizedArray('receivedFriendRequests', otherUserId, state.receivedFriendRequests),
            sentFriendRequests: normalizedArray('sentFriendRequests', otherUserId, state.sentFriendRequests),
        },
    },
];
const normalizeLocalArray = (values, otherUserId, include) => {
    const withoutOtherUser = values.filter((value) => value !== otherUserId);
    return include ? [...withoutOtherUser, otherUserId] : withoutOtherUser;
};
const getActorRelationships = (actor, targetId, state) => ({
    friends: normalizeLocalArray(actor.friends, targetId, state.friends),
    receivedFriendRequests: normalizeLocalArray(actor.receivedFriendRequests, targetId, state.incoming),
    sentFriendRequests: normalizeLocalArray(actor.sentFriendRequests, targetId, state.outgoing),
});
const mutateRelationship = (actorId, targetId, operation) => __awaiter(void 0, void 0, void 0, function* () {
    if (actorId === targetId) {
        throw new RelationshipMutationError(400, 'SELF_RELATIONSHIP', 'A user cannot create a relationship with themselves.');
    }
    const session = yield mongoose_1.default.startSession();
    let committedResult;
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield userModel_1.default.find({ _id: { $in: [actorId, targetId] } })
                .session(session)
                .exec();
            const actor = users.find((user) => user.id === actorId);
            const target = users.find((user) => user.id === targetId);
            if (!actor || !target) {
                throw new RelationshipMutationError(404, 'RELATIONSHIP_USER_NOT_FOUND', 'One of the users does not exist.');
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
            yield userModel_1.default.updateOne({ _id: actorId }, actorUpdate, { session }).exec();
            yield userModel_1.default.updateOne({ _id: targetId }, targetUpdate, { session }).exec();
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
        }));
    }
    finally {
        yield session.endSession();
    }
    if (!committedResult) {
        throw new Error('Relationship transaction did not commit.');
    }
    return committedResult;
});
exports.mutateRelationship = mutateRelationship;
