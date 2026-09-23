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
exports.completePasswordReset = exports.verifyPasswordResetCode = exports.requestPasswordReset = exports.validatePasswordResetConfiguration = exports.PASSWORD_RESET_MAX_ATTEMPTS = exports.PASSWORD_RESET_RESEND_COOLDOWN_MS = exports.PASSWORD_RESET_TOKEN_TTL_MS = exports.PASSWORD_RESET_CODE_TTL_MS = void 0;
const crypto_1 = require("crypto");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const userModel_1 = __importDefault(require("../models/userModel"));
mail_1.default.setApiKey(`${process.env.SENDGRID_API_KEY}`);
exports.PASSWORD_RESET_CODE_TTL_MS = 10 * 60 * 1000;
exports.PASSWORD_RESET_TOKEN_TTL_MS = 10 * 60 * 1000;
exports.PASSWORD_RESET_RESEND_COOLDOWN_MS = 60 * 1000;
exports.PASSWORD_RESET_MAX_ATTEMPTS = 5;
const PASSWORD_RESET_SECRET_MINIMUM_BYTES = 32;
const getPasswordResetSecret = () => {
    const secret = process.env.PASSWORD_RESET_SECRET;
    if (!secret || Buffer.byteLength(secret, 'utf8') < PASSWORD_RESET_SECRET_MINIMUM_BYTES) {
        throw new Error('PASSWORD_RESET_SECRET must contain at least 32 UTF-8 bytes');
    }
    return secret;
};
const validatePasswordResetConfiguration = () => {
    getPasswordResetSecret();
};
exports.validatePasswordResetConfiguration = validatePasswordResetConfiguration;
const digestCredential = (purpose, email, credential) => (0, crypto_1.createHmac)('sha256', getPasswordResetSecret())
    .update(`${purpose}:${email}:${credential}`)
    .digest('hex');
const createResetCode = () => (0, crypto_1.randomInt)(0, 1000000).toString().padStart(6, '0');
const createResetToken = () => (0, crypto_1.randomBytes)(32).toString('base64url');
const sendResetCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const message = `Here is your six digit ScheduleFinder password reset code: ${code}`;
    yield mail_1.default.send({
        to: email,
        from: 'schedulefinder@gmail.com',
        subject: 'ScheduleFinder - Password Reset',
        text: message,
        html: `<p>Here is your six digit ScheduleFinder password reset code:</p><strong>${code}</strong>`,
    });
});
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const code = createResetCode();
    const codeDigest = digestCredential('code', email, code);
    const resendCutoff = new Date(now.getTime() - exports.PASSWORD_RESET_RESEND_COOLDOWN_MS);
    const user = yield userModel_1.default.findOneAndUpdate({
        email,
        $or: [
            { 'passwordReset.requestedAt': { $exists: false } },
            { 'passwordReset.requestedAt': { $lte: resendCutoff } },
        ],
    }, {
        $set: {
            passwordReset: {
                codeDigest,
                codeExpiresAt: new Date(now.getTime() + exports.PASSWORD_RESET_CODE_TTL_MS),
                failedAttempts: 0,
                requestedAt: now,
            },
        },
    }, { new: true })
        .select('email')
        .exec();
    if (!user) {
        return;
    }
    try {
        yield sendResetCode(user.email, code);
    }
    catch (_a) {
        yield userModel_1.default.updateOne({ _id: user._id, 'passwordReset.codeDigest': codeDigest }, { $unset: { passwordReset: 1 } }).exec();
    }
});
exports.requestPasswordReset = requestPasswordReset;
const verifyPasswordResetCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const codeDigest = digestCredential('code', email, code);
    const resetToken = createResetToken();
    const resetTokenDigest = digestCredential('token', email, resetToken);
    const verifiedUser = yield userModel_1.default.findOneAndUpdate({
        email,
        'passwordReset.codeDigest': codeDigest,
        'passwordReset.codeExpiresAt': { $gt: now },
        'passwordReset.failedAttempts': { $lt: exports.PASSWORD_RESET_MAX_ATTEMPTS },
    }, {
        $set: {
            'passwordReset.resetTokenDigest': resetTokenDigest,
            'passwordReset.resetTokenExpiresAt': new Date(now.getTime() + exports.PASSWORD_RESET_TOKEN_TTL_MS),
        },
        $unset: {
            'passwordReset.codeDigest': 1,
            'passwordReset.codeExpiresAt': 1,
            'passwordReset.failedAttempts': 1,
        },
    }, { new: true })
        .select('_id')
        .exec();
    if (verifiedUser) {
        return {
            resetToken,
            expiresInSeconds: exports.PASSWORD_RESET_TOKEN_TTL_MS / 1000,
        };
    }
    yield userModel_1.default.updateOne({
        email,
        'passwordReset.codeDigest': { $exists: true },
        'passwordReset.codeExpiresAt': { $gt: now },
        'passwordReset.failedAttempts': { $lt: exports.PASSWORD_RESET_MAX_ATTEMPTS },
    }, { $inc: { 'passwordReset.failedAttempts': 1 } }).exec();
    return null;
});
exports.verifyPasswordResetCode = verifyPasswordResetCode;
const completePasswordReset = (email, resetToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const resetTokenDigest = digestCredential('token', email, resetToken);
    const proofFilter = {
        email,
        'passwordReset.resetTokenDigest': resetTokenDigest,
        'passwordReset.resetTokenExpiresAt': { $gt: now },
    };
    const proofExists = yield userModel_1.default.exists(proofFilter);
    if (!proofExists) {
        return false;
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, yield bcrypt_1.default.genSalt());
    const updatedUser = yield userModel_1.default.findOneAndUpdate(proofFilter, {
        $set: { password: hashedPassword },
        $unset: { passwordReset: 1 },
    }, { new: true })
        .select('_id')
        .exec();
    return updatedUser !== null;
});
exports.completePasswordReset = completePasswordReset;
