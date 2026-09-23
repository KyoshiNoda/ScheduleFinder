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
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepresentation_1 = require("../representations/userRepresentation");
const accessToken_1 = require("../auth/accessToken");
const passwordReset_1 = require("../auth/passwordReset");
class AuthController {
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield userModel_1.default.findOne({ email }).select('+password');
                if (!user) {
                    return res.status(400).send({ error: 'Email not found.' });
                }
                const match = yield bcrypt_1.default.compare(password, user.password);
                if (!match) {
                    return res.status(400).send({ error: 'Incorrect password.' });
                }
                const accessToken = (0, accessToken_1.signAccessToken)(user.id);
                res.send({ token: accessToken, user: (0, userRepresentation_1.toAuthUser)(user) });
            }
            catch (err) {
                res.status(500).send({ error: 'Unable to log in.' });
            }
        });
    }
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, school, birthday } = req.body;
            const userExists = yield userModel_1.default.findOne({ email });
            if (userExists) {
                return res.status(400).send({ error: 'Email already in use.' });
            }
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const user = new userModel_1.default({
                firstName: firstName,
                lastName: lastName,
                birthday: birthday,
                photoURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s',
                email: email,
                password: hashedPassword,
                school: school,
                gender: null,
                major: null,
            });
            try {
                const savedUser = yield user.save();
                const accessToken = (0, accessToken_1.signAccessToken)(savedUser.id);
                res.status(200).send({ token: accessToken, user: (0, userRepresentation_1.toAuthUser)(savedUser) });
            }
            catch (err) {
                return res.status(500).send({ error: 'Unable to register user.' });
            }
        });
    }
    static resetPasswordRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, passwordReset_1.requestPasswordReset)(req.body.email);
                return res.status(202).json({
                    message: 'If an account exists, a reset code will be sent.',
                });
            }
            catch (_a) {
                return res.status(500).json({ error: 'Unable to process password reset request.' });
            }
        });
    }
    static verifyResetPasswordCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifiedReset = yield (0, passwordReset_1.verifyPasswordResetCode)(req.body.email, req.body.code);
                if (!verifiedReset) {
                    return res.status(400).json({
                        error: 'Invalid or expired reset code.',
                        code: 'INVALID_RESET_CODE',
                    });
                }
                return res.status(200).json(verifiedReset);
            }
            catch (_a) {
                return res.status(500).json({ error: 'Unable to verify password reset code.' });
            }
        });
    }
    static completePasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordChanged = yield (0, passwordReset_1.completePasswordReset)(req.body.email, req.body.resetToken, req.body.newPassword);
                if (!passwordChanged) {
                    return res.status(400).json({
                        error: 'Invalid or expired reset proof.',
                        code: 'INVALID_RESET_PROOF',
                    });
                }
                return res.status(200).json({ message: 'Password changed.' });
            }
            catch (_a) {
                return res.status(500).json({ error: 'Unable to complete password reset.' });
            }
        });
    }
}
exports.default = AuthController;
