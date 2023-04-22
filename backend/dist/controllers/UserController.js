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
class UserController {
    // GET all user
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.default.find({}, (err, found) => {
                if (!err) {
                    res.send(found);
                }
                else {
                    throw err;
                }
            })
                .clone()
                .catch((err) => console.log(err));
        });
    }
    // GET single user by id
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield userModel_1.default.find({ _id: id }, (err, found) => {
                if (!err) {
                    res.send(found);
                }
                else {
                    throw err;
                }
            })
                .clone()
                .catch((err) => console.log(err));
        });
    }
    // DELETE user by id
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const deletedUser = yield userModel_1.default.findOneAndDelete({ _id: id });
            if (!deletedUser) {
                return res.json({ error: `User with id ${id} was not found` });
            }
            res.status(200).json(deletedUser);
        });
    }
    // PATCH user by id
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (req.body.password) {
                const newPassword = req.body.password;
                const salt = yield bcrypt_1.default.genSalt();
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: id }, Object.assign(Object.assign({}, req.body), { password: hashedPassword }), { returnOriginal: false });
                res.status(200).json(updatedUser);
            }
            else {
                try {
                    const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: id }, Object.assign({}, req.body), { returnOriginal: false });
                    res.status(200).json(updatedUser);
                }
                catch (error) {
                    res.json(`The update attempt to user ${id} has failed`);
                }
            }
        });
    }
}
exports.default = UserController;
