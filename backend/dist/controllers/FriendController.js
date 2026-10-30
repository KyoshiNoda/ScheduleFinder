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
const outbound_1 = require("../integrations/outbound");
const userModel_1 = __importDefault(require("../models/userModel"));
const userRepresentation_1 = require("../representations/userRepresentation");
const relationshipMutations_1 = require("../relationships/relationshipMutations");
const getPublicUsers = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find({ _id: { $in: ids } }).exec();
    return users.map(userRepresentation_1.toPublicUser);
});
const sendRelationshipMutationError = (res, error) => {
    if (error instanceof relationshipMutations_1.RelationshipMutationError) {
        return res.status(error.status).json({ error: error.message, code: error.code });
    }
    return res.status(500).json({ error: 'Unable to update relationship.' });
};
const sendFriendRequestNotification = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    const senderName = `${notification.senderFirstName} ${notification.senderLastName}`;
    yield (0, outbound_1.sendEmail)({
        to: notification.recipientEmail,
        from: 'schedulefinder@gmail.com',
        subject: 'ScheduleFinder - Friend Request',
        text: `You have a new friend request from ${senderName}. Log in to ScheduleFinder to respond.`,
    });
});
const sendNotificationAfterCommit = (result) => __awaiter(void 0, void 0, void 0, function* () {
    if (!result.notification) {
        return;
    }
    try {
        yield sendFriendRequestNotification(result.notification);
    }
    catch (_a) {
        console.error('Unable to send friend-request notification after the request committed.');
    }
});
class FriendController {
    static getFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                const userFriends = yield userModel_1.default.find({
                    _id: { $in: user.friends },
                }).exec();
                return res.json(userFriends.map(userRepresentation_1.toPublicUser));
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static deleteFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const friendID = req.params.friendID;
            try {
                const result = yield (0, relationshipMutations_1.mutateRelationship)(userID, friendID, 'unfriend');
                const friends = yield getPublicUsers(result.actorRelationships.friends);
                return res.status(200).send({
                    message: 'Friend removed successfully!',
                    friends,
                });
            }
            catch (error) {
                return sendRelationshipMutationError(res, error);
            }
        });
    }
    static getFriendRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const userFriendRequests = [];
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                for (const friendID of user.receivedFriendRequests) {
                    const friend = yield userModel_1.default.findOne({ _id: friendID }).exec();
                    if (friend) {
                        userFriendRequests.push(friend);
                    }
                }
                return res.send(userFriendRequests.map(userRepresentation_1.toPublicUser));
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static getPendingFriendRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const sentFriendRequests = [];
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                for (const friendID of user.sentFriendRequests) {
                    const friend = yield userModel_1.default.findOne({ _id: friendID }).exec();
                    if (friend) {
                        sentFriendRequests.push(friend);
                    }
                }
                return res.send(sentFriendRequests.map(userRepresentation_1.toPublicUser));
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static sendFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const friendID = req.params.friendID;
            try {
                const result = yield (0, relationshipMutations_1.mutateRelationship)(userID, friendID, 'send');
                yield sendNotificationAfterCommit(result);
                return res.status(200).send({
                    message: result.outcome === 'friendship-created'
                        ? 'Friend request accepted successfully!'
                        : 'Friend request sent successfully!',
                });
            }
            catch (error) {
                return sendRelationshipMutationError(res, error);
            }
        });
    }
    static removeFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const friendID = req.params.friendID;
            try {
                yield (0, relationshipMutations_1.mutateRelationship)(userID, friendID, 'reject');
                return res.status(200).send({
                    message: 'Removed friend request successfully!',
                });
            }
            catch (error) {
                return sendRelationshipMutationError(res, error);
            }
        });
    }
    static acceptFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const friendID = req.params.friendID;
            try {
                const result = yield (0, relationshipMutations_1.mutateRelationship)(userID, friendID, 'accept');
                const updatedFriendRequests = yield getPublicUsers(result.actorRelationships.receivedFriendRequests);
                return res.status(200).send({
                    message: 'Added friend successfully!',
                    updatedFriendRequests,
                });
            }
            catch (error) {
                return sendRelationshipMutationError(res, error);
            }
        });
    }
    static rejectFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const friendID = req.params.friendID;
            try {
                const result = yield (0, relationshipMutations_1.mutateRelationship)(userID, friendID, 'reject');
                const updatedFriendRequests = yield getPublicUsers(result.actorRelationships.receivedFriendRequests);
                return res.status(200).send({
                    message: 'Friend Request was ignored!',
                    updatedFriendRequests,
                });
            }
            catch (error) {
                return sendRelationshipMutationError(res, error);
            }
        });
    }
    static cancelPendingFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const friendID = req.params.friendID;
            try {
                const result = yield (0, relationshipMutations_1.mutateRelationship)(userID, friendID, 'cancel');
                const updatedSendFriendRequests = yield getPublicUsers(result.actorRelationships.sentFriendRequests);
                return res.status(200).send({
                    message: 'Cancelled Friend Request!',
                    updatedSendFriendRequests,
                });
            }
            catch (error) {
                return sendRelationshipMutationError(res, error);
            }
        });
    }
}
exports.default = FriendController;
