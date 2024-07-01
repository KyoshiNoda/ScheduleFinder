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
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(`${process.env.SENDGRID_API_KEY}`);
class AuthController {
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).send({ error: 'Email and password are required.' });
            }
            try {
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    return res.status(400).send({ error: 'Email not found.' });
                }
                const match = yield bcrypt_1.default.compare(password, user.password);
                if (!match) {
                    return res.status(400).send({ error: 'Incorrect password.' });
                }
                const accessToken = jsonwebtoken_1.default.sign({ data: user }, `${process.env.ACCESS_TOKEN_SECRET}`, {
                    expiresIn: '1d',
                });
                res.send({ token: accessToken, user: user });
            }
            catch (err) {
                res.status(500).send({ error: 'Unable to log in.' });
            }
        });
    }
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, school, birthday } = req.body;
            if (!firstName || !lastName || !email || !password || !school || !birthday) {
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
                photoURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s',
                email: email,
                password: hashedPassword,
                school: school,
                gender: null,
                major: null,
            });
            try {
                const savedUser = yield user.save();
                const accessToken = jsonwebtoken_1.default.sign({ data: savedUser }, `${process.env.ACCESS_TOKEN_SECRET}`, {
                    expiresIn: '1d',
                });
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
    static emailCheck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            try {
                const user = yield userModel_1.default.findOne({ email }).exec();
                if (!user) {
                    return res.status(404).json({ message: 'Invalid Email' });
                }
                return res.status(200).json({ message: 'User found!' });
            }
            catch (error) {
                console.error('Error while checking email:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    static resetPasswordRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let randomCode = (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString();
            AuthController.randomCode = randomCode;
            let message = `Here is your five digit code: ${AuthController.randomCode}`;
            let codeHTML = '';
            for (let digit of AuthController.randomCode) {
                codeHTML += `<div style="display: inline-block; margin: 5px; padding: 10px; background-color: #fff; color: #3b82f6; border-radius: 5px;">${digit}</div>`;
            }
            const msg = {
                to: email,
                from: 'schedulefinder@gmail.com',
                subject: 'ScheduleFinder - Password Reset',
                text: message,
                html: `<strong>${message}</strong>`,
            };
            mail_1.default
                .send(msg)
                .then(() => {
                res.status(200).send({ message: 'email sent!', email: email });
            })
                .catch((error) => {
                res.status(400).send({ error: 'error found try again!' });
            });
        });
    }
    static verifyResetPasswordCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const code = req.body.code;
                if (code === AuthController.randomCode) {
                    return res.status(200).send({ message: 'User can reset password' });
                }
                AuthController.randomCode = (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString();
                let codeHTML = '';
                for (let digit of AuthController.randomCode) {
                    codeHTML += `<div style="display: inline-block; margin: 5px; padding: 10px; background-color: #fff; color: #3b82f6; border-radius: 5px;">${digit}</div>`;
                }
                let message = `Here is your five digit code: ${AuthController.randomCode}`;
                const msg = {
                    to: email,
                    from: 'schedulefinder@gmail.com',
                    subject: 'ScheduleFinder - Password Reset',
                    text: message,
                    html: `
          <div style="font-family: Arial, sans-serif; color: #fff; background-color: #3b82f6; padding: 20px;">
            <h2 style="color: #fff;">ScheduleFinder - Password Reset</h2>
            <p><strong>Here is your five digit code:</strong></p>
            <div style="font-size: 2em;">${codeHTML}</div>
            <p>Please enter this code and reset your password.</p>
          </div>
        `,
                };
                yield mail_1.default.send(msg);
                return res.status(400).send({
                    message: 'Incorrect code! Sending another email with a new code',
                });
            }
            catch (error) {
                return res.status(500).send({ message: 'Error found. Please try again!' });
            }
        });
    }
}
exports.default = AuthController;
