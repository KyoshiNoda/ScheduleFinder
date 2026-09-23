"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passwordResetSchema = new mongoose_1.default.Schema({
    codeDigest: String,
    codeExpiresAt: Date,
    failedAttempts: Number,
    requestedAt: { type: Date, required: true },
    resetTokenDigest: String,
    resetTokenExpiresAt: Date,
}, { _id: false });
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
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
    passwordReset: {
        type: passwordResetSchema,
        select: false,
        default: undefined,
    },
});
const User = (_a = mongoose_1.default.models.User) !== null && _a !== void 0 ? _a : mongoose_1.default.model('User', userSchema);
exports.default = User;
