import express from 'express';
import FriendController from '../controllers/FriendController';
import { authenticateToken } from '../auth/authenticateToken';
const router = express.Router();

router.get(
  '/',
  authenticateToken,
  FriendController.getFriendRequests
);
router.get(
  '/sent',
  authenticateToken,
  FriendController.getPendingFriendRequests
);

router.delete(
  '/sent/:friendID',
  authenticateToken,
  FriendController.cancelPendingFriendRequest
);

router.post(
  '/:friendID',
  authenticateToken,
  FriendController.sendFriendRequest
);

router.delete(
  '/:friendID',
  authenticateToken,
  FriendController.removeFriendRequest
);
export default router;
