"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const accessToken_1 = require("./accessToken");
const BEARER_TOKEN_PATTERN = /^Bearer[ \t]+([^ \t]+)[ \t]*$/i;
const AUTHENTICATION_ERROR = { error: 'Authentication required.' };
const rejectAuthentication = (res) => res.set('WWW-Authenticate', 'Bearer').status(401).json(AUTHENTICATION_ERROR);
const authenticateToken = (req, res, next) => {
    var _a;
    const authorizationHeader = req.get('authorization');
    const token = (_a = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.match(BEARER_TOKEN_PATTERN)) === null || _a === void 0 ? void 0 : _a[1];
    if (!token) {
        rejectAuthentication(res);
        return;
    }
    try {
        const claims = (0, accessToken_1.verifyAccessToken)(token);
        req.auth = { userId: claims.sub };
        next();
    }
    catch (_b) {
        rejectAuthentication(res);
    }
};
exports.authenticateToken = authenticateToken;
