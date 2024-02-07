"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
    friends: [{ type: String }],
    receivedFriendRequests: [{ type: String }],
    sentFriendRequests: [{ type: String }],
    age: Number,
    photoURL: String,
    gender: String,
    school: String,
    major: String,
    hobbies: [{ type: String }],
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
