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
const tagModel_1 = __importDefault(require("../models/tagModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class TagController {
    // GET user's tags by token
    static getUserTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
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
    // PATCH user's tags by token
    static updateUserTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // DELETE single user's tag by token
    static deleteUserTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // DELETE all user's tags by token
    static clearUserTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // GET all tags
    static getAllTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allTags = yield tagModel_1.default.find({});
                res.status(200).send(allTags);
            }
            catch (error) {
                res.status(500).json({ message: 'Error while getting tags', error: error });
            }
        });
    }
    // POST new tag
    static createTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name: newTagName } = req.body || null;
            if (newTagName === null) {
                res.status(400).json({ message: 'Error while getting new tag name', error: 'Possible malformed request' });
            }
            try {
                const createdTag = yield tagModel_1.default.create({ name: newTagName });
                res.status(201).json(createdTag);
            }
            catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = TagController;
