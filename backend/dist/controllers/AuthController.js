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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModal_1.default.findOne({ email: req.body.email }, (err, found) => __awaiter(this, void 0, void 0, function* () {
                if (!(found === undefined)) {
                    if (yield bcrypt_1.default.compare(req.body.password, found.password)) {
                        return found;
                    }
                    else {
                        res.send("not allowed");
                    }
                }
                else {
                    res.status(400).send("No user Found");
                }
            })).clone().exec().then((docs => {
                const accessToken = jsonwebtoken_1.default.sign({ data: docs }, `${process.env.ACCESS_TOKEN_SECRET}`);
                res.send({ token: accessToken });
            }));
        });
    }
    static authUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(" ")[1];
            if (token === null) {
                return res.sendStatus(401);
            }
            jsonwebtoken_1.default.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        });
    }
}
exports.default = AuthController;
