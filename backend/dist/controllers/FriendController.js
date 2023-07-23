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
const userModel_1 = __importDefault(require("../models/userModel"));
class FriendController {
    static getFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                res.send(user.friends);
            }
            catch (err) {
                console.error(err);
                res.status(500).ssend({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static deleteFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            const friendID = req.params.friendID;
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                const friend = yield userModel_1.default.findOne({ _id: friendID }).exec();
                if (!user || !friend) {
                    return res.status(404).send({
                        message: 'One of the users is missing!',
                    });
                }
                if (!user.friends.includes(friendID)) {
                    return res.status(404).send({
                        message: `User is not friends with ${(friend.firstName, +' ' + friend.lastName)}`,
                    });
                }
                user.friends = user.friends.filter((id) => id !== friendID);
                yield user.save();
                friend.friends = friend.friends.filter((id) => id !== userID);
                yield friend.save();
                return res.status(200).send({
                    message: 'Friend removed successfully!',
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).ssend({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static sendFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            const friendID = req.params.friendID;
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                const friend = yield userModel_1.default.findOne({ _id: friendID }).exec();
                if (!user || !friend) {
                    return res.status(404).send({
                        message: "One of the users doesn't exist!",
                    });
                }
                if (!user.friendRequests.includes(friendID)) {
                    user.friendRequests.push(friendID);
                    yield user.save();
                }
                if (!friend.friendRequests.includes(userID)) {
                    friend.friendRequests.push(userID);
                    yield friend.save();
                }
                return res.status(200).send({
                    message: 'Friend request sent successfully!',
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).ssend({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static removeFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            const friendID = req.params.friendID;
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                const friend = yield userModel_1.default.findOne({ _id: friendID }).exec();
                if (!user || !friend) {
                    return res.status(404).send({
                        message: "One of the users doesn't exist!",
                    });
                }
                if (user.friendRequests.includes(friendID)) {
                    user.friendRequests = user.friendRequests.filter((id) => id !== friendID);
                    yield user.save();
                }
                if (friend.friendRequests.includes(userID)) {
                    friend.friendRequests = friend.friendRequests.filter((id) => id !== userID);
                    yield friend.save();
                }
                return res.status(200).send({
                    message: 'Removed friend request successfully!',
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).ssend({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
}
exports.default = FriendController;
