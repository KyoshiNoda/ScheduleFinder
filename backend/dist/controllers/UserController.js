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
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const userRepresentation_1 = require("../representations/userRepresentation");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const defaultProfilePicture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s';
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const uploadedFile = req.file;
                const fileBuffer = uploadedFile.buffer;
                const fileData = fileBuffer.toString('base64');
                const user = yield userModel_1.default.findOne({ _id: userID }).exec();
                if (!user) {
                    return res.status(404).json({
                        message: `User ${userID} not found`,
                    });
                }
                if ((user === null || user === void 0 ? void 0 : user.photoURL) !== defaultProfilePicture) {
                    const publicID = (_a = user === null || user === void 0 ? void 0 : user.photoURL.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                    yield cloudinary_1.v2.uploader.destroy('uploads/' + publicID);
                }
                const result = yield cloudinary_1.v2.uploader.upload(`data:image/jpeg;base64,${fileData}`, {
                    folder: 'uploads',
                    transformation: [
                        { width: 300, height: 300, crop: 'fill' }, // Replace 300 with your desired width and height
                    ],
                });
                user.photoURL = result.secure_url;
                yield user.save();
                res.status(200).send({
                    message: 'Profile picture updated successfully',
                    imageUrl: result.secure_url,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    message: `Error updating User ${userID}'s photoURL`,
                    error: err,
                });
            }
        });
    }
    static deleteProfilePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const user = yield userModel_1.default.findOneAndUpdate({ _id: userID }, {
                    photoURL: defaultProfilePicture,
                }).exec();
                res.status(200).send({
                    message: 'Profile picture removed successfully',
                });
                if (!user) {
                    return res.status(404).json({
                        message: `User ${userID} not found`,
                    });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    message: `Error removing User ${userID}'s photoURL`,
                    error: err,
                });
            }
        });
    }
}
exports.default = UserController;
