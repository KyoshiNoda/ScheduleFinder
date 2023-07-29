import express from 'express';
import FriendController from '../controllers/FriendController';
import AuthController from '../controllers/AuthController';
const router = express.Router();

router.get(
  '/',
  AuthController.authenticateToken,
  FriendController.getFriendRequests
);

router.post(
  '/:friendID',
  AuthController.authenticateToken,
  FriendController.sendFriendRequest
);

router.delete(
  '/:friendID',
  AuthController.authenticateToken,
  FriendController.removeFriendRequest
);
export default router;
