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
const userModal_1 = __importDefault(require("../models/userModal"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModal_1.default.find({}, (err, found) => {
                if (!err) {
                    res.send(found);
                }
                else {
                    throw err;
                }
            }).clone().catch(err => console.log(err));
        });
    }
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield userModal_1.default.find({ _id: id }, (err, found) => {
                if (!err) {
                    res.send(found);
                }
                else {
                    throw err;
                }
            }).clone().catch(err => console.log(err));
        });
    }
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
            const user = new userModal_1.default({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedPassword,
                gender: req.body.gender,
                school: req.body.school
            });
            user.save().then(() => {
                console.log("one entry added");
            })
                .catch((err) => {
                console.log(err);
            });
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield userModal_1.default.deleteOne({ _id: id }, (err, deleted) => {
                if (!err) {
                    res.send(`user ${id} was deleted!`);
                }
                else {
                    throw err;
                }
            }).clone().catch(err => console.log(err));
        });
    }
    static updateFirstName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const newFirstName = req.body.firstName;
            userModal_1.default.updateOne({ _id: id }, {
                $set: { firstName: newFirstName }
            }, (err, updatedItem) => {
                if (!err) {
                    res.send(`updated item ${id}`);
                }
                else {
                    throw err;
                }
            }).clone().catch(err => console.log(err));
        });
    }
    static updateLastName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const newLastName = req.body.lastName;
            userModal_1.default.updateOne({ _id: id }, {
                $set: { lastName: newLastName }
            }, (err, updatedItem) => {
                if (!err) {
                    res.send(`updated item ${id}`);
                }
                else {
                    throw err;
                }
            }).clone().catch(err => console.log(err));
        });
    }
    static updateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const newEmail = req.body.email;
            userModal_1.default.updateOne({ _id: id }, {
                $set: { email: newEmail }
            }, (err, updatedItem) => {
                if (!err) {
                    res.send(`change email at ${id}`);
                }
                else {
                    throw err;
                }
            }).clone().catch(err => console.log(err));
        });
    }
    static updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPassword = req.body.password;
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
            const id = req.params.id;
            userModal_1.default.updateOne({ _id: id }, {
                $set: { password: hashedPassword }
            }, (err, updatedItem) => {
                if (!err) {
                    res.send(`updated password on item ${id}`);
                }
                else {
                    throw err;
                }
            }).clone().catch(err => console.log(err));
        });
    }
}
exports.default = UserController;
