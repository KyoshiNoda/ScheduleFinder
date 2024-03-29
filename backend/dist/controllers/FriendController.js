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
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(`${process.env.SENDGRID_API_KEY}`);
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
                // Populate the 'friends' field with user objects
                const userFriends = yield userModel_1.default.find({
                    _id: { $in: user.friends },
                }).exec();
                res.json(userFriends); // Return the array of friend objects
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
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
                const updatedUser = yield userModel_1.default.findOne({ _id: userID }).exec();
                // Query for all the friends in the updated friend list
                const updatedUserFriends = yield userModel_1.default.find({
                    _id: { $in: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.friends },
                }).exec();
                return res.status(200).send({
                    message: 'Friend removed successfully!',
                    friends: updatedUserFriends,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static getFriendRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            let userFriendRequests = [];
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                for (const friendID of user.receivedFriendRequests) {
                    let friend = yield userModel_1.default.findOne({ _id: friendID }).exec();
                    if (friend) {
                        userFriendRequests.push(friend);
                    }
                }
                res.send(userFriendRequests);
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static getPendingFriendRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            let sentFriendRequests = [];
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                for (const friendID of user.sentFriendRequests) {
                    let friend = yield userModel_1.default.findOne({ _id: friendID }).exec();
                    if (friend) {
                        sentFriendRequests.push(friend);
                    }
                }
                res.send(sentFriendRequests);
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
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
                if (!user.sentFriendRequests.includes(friendID)) {
                    user.sentFriendRequests.push(friendID);
                    yield user.save();
                }
                else {
                    return res.status(404).send({
                        message: 'Friend Request Already Send!',
                    });
                }
                if (!friend.receivedFriendRequests.includes(userID)) {
                    friend.receivedFriendRequests.push(userID);
                    yield friend.save();
                    const msg = {
                        to: friend.email,
                        from: 'schedulefinder@gmail.com',
                        subject: 'ScheduleFinder - Friend Request',
                        text: `You have a new friend request from ${user.firstName} ${user.lastName}!`,
                        html: `
            <div style="font-family: Arial, sans-serif; color: #fff; background-color: #3b82f6; padding: 20px;">
              <h2 style="color: #fff;">ScheduleFinder - Friend Request</h2>
              <p><strong>You have a new friend request from ${user.firstName} ${user.lastName}!</strong></p>
              <div style="display: flex; justify-content: space-between;">
                <ul style="margin-right: 20px;">
                  <li>First Name: ${user.firstName}</li>
                  <li>Last Name: ${user.lastName}</li>
                  <li>School: ${user.school}</li>
                  <li>Major: ${user.major ? user.major : 'N/A'}</li>
                </ul>
                <img src="${user.photoURL}" alt="Friend's Photo" style="border-radius: 50%; width: 100px; height: 100px; align-self: flex-start;">
              </div>
              <p>Please <a href="https://schedulefinder.netlify.app/" style="color: #fff; text-decoration: underline;">log in</a> to your account to accept or decline this request.</p>
            </div>
          `,
                    };
                    yield mail_1.default.send(msg);
                }
                else {
                    return res.status(404).send({
                        message: 'Friend Request Already Send!',
                    });
                }
                return res.status(200).send({
                    message: 'Friend request sent successfully!',
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
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
                if (user.receivedFriendRequests.includes(friendID)) {
                    user.receivedFriendRequests = user.receivedFriendRequests.filter((id) => id !== friendID);
                    yield user.save();
                }
                if (friend.sentFriendRequests.includes(userID)) {
                    friend.sentFriendRequests = friend.sentFriendRequests.filter((id) => id !== userID);
                    yield friend.save();
                }
                return res.status(200).send({
                    message: 'Removed friend request successfully!',
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static acceptFriendRequest(req, res) {
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
                if (!user.receivedFriendRequests.includes(friendID) ||
                    !friend.sentFriendRequests.includes(userID)) {
                    return res.status(404).send({
                        message: 'Missing Friend Request',
                    });
                }
                user.friends.push(friendID);
                user.receivedFriendRequests = user.receivedFriendRequests.filter((id) => id !== friendID);
                yield user.save();
                friend.friends.push(userID);
                friend.sentFriendRequests = friend.sentFriendRequests.filter((id) => id !== userID);
                yield friend.save();
                const updatedUser = yield userModel_1.default.findOne({ _id: userID }).exec();
                const updatedUserFriendRequests = yield userModel_1.default.find({
                    _id: { $in: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.receivedFriendRequests },
                }).exec();
                res.status(200).send({
                    message: 'Added friend successfully!',
                    updatedFriendRequests: updatedUserFriendRequests,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static rejectFriendRequest(req, res) {
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
                user.receivedFriendRequests = user.receivedFriendRequests.filter((id) => id !== friendID);
                yield user.save();
                friend.sentFriendRequests = friend.sentFriendRequests.filter((id) => id !== userID);
                yield friend.save();
                const updatedUser = yield userModel_1.default.findOne({ _id: userID }).exec();
                const updatedUserFriendRequests = yield userModel_1.default.find({
                    _id: { $in: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.receivedFriendRequests },
                }).exec();
                res.status(200).send({
                    message: 'Friend Request was ignored!',
                    updatedFriendRequests: updatedUserFriendRequests,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    static cancelPendingFriendRequest(req, res) {
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
                user.sentFriendRequests = user.sentFriendRequests.filter((id) => id !== friend.id);
                yield user.save();
                friend.receivedFriendRequests = friend.receivedFriendRequests.filter((id) => id !== user.id);
                yield friend.save();
                const updatedUser = yield userModel_1.default.findOne({ _id: userID }).exec();
                const updatedSendFriendRequests = yield userModel_1.default.find({
                    _id: { $in: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.sentFriendRequests },
                }).exec();
                res.status(200).send({
                    message: 'Cancelled Friend Request!',
                    updatedSendFriendRequests: updatedSendFriendRequests,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
}
exports.default = FriendController;
