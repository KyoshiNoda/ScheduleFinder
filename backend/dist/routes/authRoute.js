"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = express_1.default.Router();
router.post('/register', AuthController_1.default.registerUser);
router.post('/login', AuthController_1.default.loginUser);
router.post('/emailCheck', AuthController_1.default.emailCheck);
router.post('/resetPasswordRequest', AuthController_1.default.resetPasswordRequest);
router.post('/verifyResetPasswordCode', AuthController_1.default.verifyResetPasswordCode);
router.post('/newAccount', AuthController_1.default.newAccount);
exports.default = router;
