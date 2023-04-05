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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = req.body.password;
            if (!email || !password) {
                return res.status(400).send('Email and password are required.');
            }
            const user = yield userModel_1.default.findOne({ email });
            if (!user) {
                return res.status(400).send('User not found.');
            }
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (!match) {
                return res.status(400).send('Incorrect password.');
            }
            const accessToken = jsonwebtoken_1.default.sign({ data: user }, `${process.env.ACCESS_TOKEN_SECRET}`);
            res.send({ token: accessToken });
        });
    }
    static authenticateToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
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
