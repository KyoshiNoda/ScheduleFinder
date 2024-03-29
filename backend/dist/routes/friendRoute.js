"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FriendController_1 = __importDefault(require("../controllers/FriendController"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = express_1.default.Router();
router.get('/', AuthController_1.default.authenticateToken, FriendController_1.default.getFriends);
router.delete('/:friendID', AuthController_1.default.authenticateToken, FriendController_1.default.deleteFriend);
router.post('/accept/:friendID', AuthController_1.default.authenticateToken, FriendController_1.default.acceptFriendRequest);
router.post('/reject/:friendID', AuthController_1.default.authenticateToken, FriendController_1.default.rejectFriendRequest);
exports.default = router;
