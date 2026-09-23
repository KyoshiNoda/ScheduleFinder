"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const schemas_1 = require("../validation/schemas");
const validateRequest_1 = require("../validation/validateRequest");
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.validateRequest)({ body: schemas_1.registerBodySchema }), AuthController_1.default.registerUser);
router.post('/login', (0, validateRequest_1.validateRequest)({ body: schemas_1.loginBodySchema }), AuthController_1.default.loginUser);
router.post('/password-reset/request', (0, validateRequest_1.validateRequest)({ body: schemas_1.emailBodySchema }), AuthController_1.default.resetPasswordRequest);
router.post('/password-reset/verify', (0, validateRequest_1.validateRequest)({ body: schemas_1.verifyPasswordResetBodySchema }), AuthController_1.default.verifyResetPasswordCode);
router.post('/password-reset/complete', (0, validateRequest_1.validateRequest)({ body: schemas_1.completePasswordResetBodySchema }), AuthController_1.default.completePasswordReset);
exports.default = router;
