"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = express_1.default.Router();
router.get('/', AuthController_1.default.authenticateToken, UserController_1.default.getUserInfo);
router.patch('/', AuthController_1.default.authenticateToken, UserController_1.default.updateUser);
router.post('/changePassword/token', AuthController_1.default.authenticateToken, UserController_1.default.changePasswordWithToken);
router.post('/changePassword', UserController_1.default.changePasswordWithoutToken);
router.get('/allUsers', UserController_1.default.getAllUsers);
router.get('/:id', UserController_1.default.getUserById);
router.delete('/:id', UserController_1.default.deleteUser);
exports.default = router;
