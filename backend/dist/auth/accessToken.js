"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = '1d';
const DURATION_PATTERN = /^(\d+)(?:ms|s|m|h|d|w|y)$/; // time units such as seconds, minutes, hours etc.
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i; // accepts only ObjectID from mongoDB
const getAccessTokenSecret = () => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error('ACCESS_TOKEN_SECRET is required');
    }
    return secret;
};
const getAccessTokenExpiry = () => {
    var _a;
    const expiresIn = (_a = process.env.ACCESS_TOKEN_EXPIRES_IN) !== null && _a !== void 0 ? _a : DEFAULT_ACCESS_TOKEN_EXPIRES_IN;
    const durationMatch = expiresIn.match(DURATION_PATTERN);
    if (!durationMatch || Number(durationMatch[1]) <= 0) {
        throw new Error('ACCESS_TOKEN_EXPIRES_IN must be a positive duration such as 15m, 1h, or 1d');
    }
    return expiresIn;
};
const signAccessToken = (userId) => {
    if (!OBJECT_ID_PATTERN.test(userId)) {
        throw new Error('Cannot issue an access token without a valid user ID');
    }
    return jsonwebtoken_1.default.sign({}, getAccessTokenSecret(), {
        algorithm: 'HS256',
        subject: userId,
        expiresIn: getAccessTokenExpiry(),
    });
};
exports.signAccessToken = signAccessToken;
const verifyAccessToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, getAccessTokenSecret(), {
        algorithms: ['HS256'],
    });
    if (typeof decoded === 'string' ||
        typeof decoded.sub !== 'string' ||
        !OBJECT_ID_PATTERN.test(decoded.sub) ||
        typeof decoded.iat !== 'number' ||
        typeof decoded.exp !== 'number' ||
        decoded.exp <= decoded.iat) {
        throw new jsonwebtoken_1.default.JsonWebTokenError('Invalid access token subject');
    }
    return decoded;
};
exports.verifyAccessToken = verifyAccessToken;
