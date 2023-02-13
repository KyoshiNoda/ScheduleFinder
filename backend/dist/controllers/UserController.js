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
}
exports.default = UserController;
