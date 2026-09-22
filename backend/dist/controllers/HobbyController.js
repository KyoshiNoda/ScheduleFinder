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
const hobbyModel_1 = __importDefault(require("../models/hobbyModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const userRepresentation_1 = require("../representations/userRepresentation");
class HobbyController {
    // GET user's hobbies
    static getUserHobbies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                res.status(200).json({ hobbies: user.hobbies });
            }
            catch (error) {
                res.status(500).send({
                    message: `Error while getting hobbies for user with id: ${userID}`,
                    error: error,
                });
            }
        });
    }
    // PATCH user's hobbies
    static updateUserHobbies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userID = req.auth.userId;
                const { name: newHobbyName } = req.body;
                let existingHobby = yield hobbyModel_1.default.findOne({ name: newHobbyName });
                if (!existingHobby) {
                    existingHobby = yield hobbyModel_1.default.create({ name: newHobbyName });
                }
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: userID }, { $addToSet: { hobbies: existingHobby.name } }, { new: true }).exec();
                if (!updatedUser) {
                    return res.status(404).json({
                        message: `User ${userID} not found`,
                    });
                }
                res.status(existingHobby.isNew ? 201 : 200).json(existingHobby);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // DELETE single user's hobby
    static deleteUserHobby(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const { name: hobbyName } = req.params;
            try {
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: userID }, { $pull: { hobbies: hobbyName } }, { new: true }).exec();
                if (!updatedUser) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                res.status(200).json((0, userRepresentation_1.toPrivateUser)(updatedUser));
            }
            catch (error) {
                res.status(500).send({
                    message: `Error while deleting hobbie hobby for user with id: ${userID}`,
                    error: error,
                });
            }
        });
    }
    // DELETE all user's hobbies
    static clearUserHobbies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: userID }, { $set: { hobbies: [] } }, { new: true }).exec();
                if (!updatedUser) {
                    return res.status(404).send({
                        message: `User ${userID} not found`,
                    });
                }
                res.status(200).json((0, userRepresentation_1.toPrivateUser)(updatedUser));
            }
            catch (error) {
                res.status(500).send({
                    message: `Error while clearing hobbies for user with id: ${userID}`,
                    error: error,
                });
            }
        });
    }
    // GET all existing hobbies
    static getAllTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allHobbies = yield hobbyModel_1.default.find({});
                res.status(200).send(allHobbies);
            }
            catch (error) {
                res.status(500).json({ message: 'Error while getting hobbies', error: error });
            }
        });
    }
}
exports.default = HobbyController;
