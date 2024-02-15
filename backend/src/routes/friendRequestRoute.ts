import express from 'express';
import FriendController from '../controllers/FriendController';
import AuthController from '../controllers/AuthController';
const router = express.Router();

router.get(
  '/',
  AuthController.authenticateToken,
  FriendController.getFriendRequests
);
router.get(
  '/sent',
  AuthController.authenticateToken,
  FriendController.getPendingFriendRequests
);

router.delete(
  '/sent/:friendID',
  AuthController.authenticateToken,
  FriendController.cancelPendingFriendRequest
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
