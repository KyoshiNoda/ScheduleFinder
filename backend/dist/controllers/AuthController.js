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
                return res
                    .status(400)
                    .send({ error: 'Email and password are required.' });
            }
            const user = yield userModel_1.default.findOne({ email });
            if (!user) {
                return res.status(400).send({ error: 'Email not found.' });
            }
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (!match) {
                return res.status(400).send({ error: 'Incorrect password.' });
            }
            const accessToken = jsonwebtoken_1.default.sign({ data: user }, `${process.env.ACCESS_TOKEN_SECRET}`);
            res.send({ token: accessToken, user: user });
        });
    }
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, school, birthday } = req.body;
            if (!firstName ||
                !lastName ||
                !email ||
                !password ||
                !school ||
                !birthday) {
                return res.status(400).send({ error: 'All fields are required.' });
            }
            const userExists = yield userModel_1.default.findOne({ email });
            if (userExists) {
                return res.status(400).send({ error: 'Email already in use.' });
            }
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
            const user = new userModel_1.default({
                firstName: firstName,
                lastName: lastName,
                birthday: birthday,
                photoURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s",
                email: email,
                password: hashedPassword,
                school: school,
                gender: null,
                major: null,
            });
            try {
                const savedUser = yield user.save();
                const accessToken = jsonwebtoken_1.default.sign({ data: savedUser }, `${process.env.ACCESS_TOKEN_SECRET}`);
                res.status(200).send({ token: accessToken, user: savedUser });
            }
            catch (err) {
                return res.status(500).send({ error: 'Unable to register user.' });
            }
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
