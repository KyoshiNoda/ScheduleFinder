import express from 'express';
import FriendController from '../controllers/FriendController';
import AuthController from '../controllers/AuthController';
const router = express.Router();

router.get('/', AuthController.authenticateToken, FriendController.getFriends);

export default router;
