"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = express_1.default.Router();
router.get('/userTags', AuthController_1.default.authenticateToken);
router.patch('/userTags', AuthController_1.default.authenticateToken);
router.delete('/userTags/:id', AuthController_1.default.authenticateToken);
router.get('/');
router.get('/:id');
router.post('/');
