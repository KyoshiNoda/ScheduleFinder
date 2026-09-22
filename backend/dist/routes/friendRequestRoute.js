"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FriendController_1 = __importDefault(require("../controllers/FriendController"));
const authenticateToken_1 = require("../auth/authenticateToken");
const schemas_1 = require("../validation/schemas");
const validateRequest_1 = require("../validation/validateRequest");
const router = express_1.default.Router();
router.get('/', authenticateToken_1.authenticateToken, FriendController_1.default.getFriendRequests);
router.get('/sent', authenticateToken_1.authenticateToken, FriendController_1.default.getPendingFriendRequests);
router.delete('/sent/:friendID', authenticateToken_1.authenticateToken, (0, validateRequest_1.validateRequest)({ params: schemas_1.friendIdParamsSchema }), FriendController_1.default.cancelPendingFriendRequest);
router.post('/:friendID', authenticateToken_1.authenticateToken, (0, validateRequest_1.validateRequest)({ params: schemas_1.friendIdParamsSchema }), FriendController_1.default.sendFriendRequest);
router.delete('/:friendID', authenticateToken_1.authenticateToken, (0, validateRequest_1.validateRequest)({ params: schemas_1.friendIdParamsSchema }), FriendController_1.default.removeFriendRequest);
exports.default = router;
