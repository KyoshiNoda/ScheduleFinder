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
const outbound_1 = require("../integrations/outbound");
const userRepresentation_1 = require("../representations/userRepresentation");
const defaultProfilePicture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s';
const startsWithBytes = (buffer, signature) => buffer.length >= signature.length &&
    signature.every((byte, index) => buffer[index] === byte);
const imageMime = (buffer) => {
    if (startsWithBytes(buffer, [0xff, 0xd8, 0xff]))
        return 'image/jpeg';
    if (startsWithBytes(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
        return 'image/png';
    }
    if (buffer.length >= 12 &&
        buffer.toString('ascii', 0, 4) === 'RIFF' &&
        buffer.toString('ascii', 8, 12) === 'WEBP') {
        return 'image/webp';
    }
    return null;
};
const cleanupImage = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, outbound_1.destroyProfileImage)(publicId);
    }
    catch (_a) {
        console.error('Unable to remove a managed profile image.');
    }
});
class UserController {
    // GET all user
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.default.find({}, (err, found) => {
                if (!err) {
                    res.send(found.map(userRepresentation_1.toPublicUser));
                }
                else {
                    throw err;
                }
            })
                .clone()
                .catch((err) => console.log(err));
        });
    }
    // GET userInfo with Token
    static getUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).json({
                        message: `User ${userID} not found`,
                    });
                }
                res.json((0, userRepresentation_1.toPrivateUser)(user));
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    message: `Error while getting User ${userID}`,
                    error: err,
                });
            }
        });
    }
    // GET single user by id
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield userModel_1.default.findOne({ _id: id }, (err, found) => {
                if (!err) {
                    res.send(found ? (0, userRepresentation_1.toPublicUser)(found) : found);
                }
                else {
                    throw err;
                }
            })
                .clone()
                .catch((err) => console.log(err));
        });
    }
    // PATCH user by Token
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const updates = req.body;
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: userID }, { $set: updates }, { new: true });
                if (!updatedUser) {
                    return res.status(404).json({ error: 'User not found' });
                }
                return res.status(200).json((0, userRepresentation_1.toPrivateUser)(updatedUser));
            }
            catch (_a) {
                return res.status(500).json({ error: 'Unable to update user' });
            }
        });
    }
    // change password with Token
    static changePasswordWithToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userID = req.auth.userId;
                const user = yield userModel_1.default.findById(userID).select('+password');
                if (!user) {
                    return res.status(404).send({ error: 'User not found' });
                }
                const passwordMatch = yield bcrypt_1.default.compare(req.body.currentPassword, user.password);
                if (!passwordMatch) {
                    return res.status(401).send('Incorrect Password!');
                }
                const salt = yield bcrypt_1.default.genSalt();
                const hashedPassword = yield bcrypt_1.default.hash(req.body.newPassword, salt);
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: userID }, { password: hashedPassword }, { returnOriginal: false });
                if (!updatedUser) {
                    throw new Error('Error updating password');
                }
                res.status(200).send({ message: 'Password Changed!' });
            }
            catch (error) {
                res.status(500).send({ error: error.message });
            }
        });
    }
    static changeProfilePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const uploadedFile = req.file;
            if (!uploadedFile)
                return res.status(400).json({ error: 'Profile image is required.' });
            const detectedMime = imageMime(uploadedFile.buffer);
            if (!detectedMime || detectedMime !== uploadedFile.mimetype) {
                return res.status(415).json({ error: 'Profile image must be a JPEG, PNG, or WebP file.' });
            }
            let user;
            try {
                user = yield userModel_1.default.findById(userID).select('+profileImagePublicId').exec();
            }
            catch (_a) {
                return res.status(500).json({ error: 'Unable to update profile image.' });
            }
            if (!user)
                return res.status(404).json({ error: 'User not found.' });
            let replacement;
            try {
                replacement = yield (0, outbound_1.uploadProfileImage)(`data:${detectedMime};base64,${uploadedFile.buffer.toString('base64')}`);
            }
            catch (_b) {
                return res.status(502).json({ error: 'Unable to upload profile image.' });
            }
            let updated;
            try {
                updated = yield userModel_1.default.findOneAndUpdate({ _id: userID, photoURL: user.photoURL }, { $set: { photoURL: replacement.secureUrl, profileImagePublicId: replacement.publicId } }, { new: true }).exec();
            }
            catch (_c) {
                yield cleanupImage(replacement.publicId);
                return res.status(500).json({ error: 'Unable to update profile image.' });
            }
            if (!updated) {
                yield cleanupImage(replacement.publicId);
                return res.status(409).json({ error: 'Profile image changed; retry the upload.' });
            }
            if (user.profileImagePublicId)
                yield cleanupImage(user.profileImagePublicId);
            return res.status(200).json({ message: 'Profile picture updated successfully', imageUrl: replacement.secureUrl });
        });
    }
    static deleteProfilePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const user = yield userModel_1.default.findOneAndUpdate({ _id: userID }, { $set: { photoURL: defaultProfilePicture }, $unset: { profileImagePublicId: 1 } }, { new: false }).select('+profileImagePublicId').exec();
                if (!user)
                    return res.status(404).json({ error: 'User not found.' });
                if (user.profileImagePublicId)
                    yield cleanupImage(user.profileImagePublicId);
                return res.status(200).json({ message: 'Profile picture removed successfully' });
            }
            catch (_a) {
                return res.status(500).json({ error: 'Unable to remove profile image.' });
            }
        });
    }
}
exports.default = UserController;
