import express from 'express';
import FriendController from '../controllers/FriendController';
import { authenticateToken } from '../auth/authenticateToken';
import { friendIdParamsSchema } from '../validation/schemas';
import { validateRequest } from '../validation/validateRequest';
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
  validateRequest({ params: friendIdParamsSchema }),
  FriendController.cancelPendingFriendRequest
);

router.post(
  '/:friendID',
  authenticateToken,
  validateRequest({ params: friendIdParamsSchema }),
  FriendController.sendFriendRequest
);

router.delete(
  '/:friendID',
  authenticateToken,
  validateRequest({ params: friendIdParamsSchema }),
  FriendController.removeFriendRequest
);
export default router;
