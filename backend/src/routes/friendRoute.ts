import express from 'express';
import FriendController from '../controllers/FriendController';
import { authenticateToken } from '../auth/authenticateToken';
import { friendIdParamsSchema } from '../validation/schemas';
import { validateRequest } from '../validation/validateRequest';
const router = express.Router();

router.get('/',
  authenticateToken,
  FriendController.getFriends
);

router.delete(
  '/:friendID',
  authenticateToken,
  validateRequest({ params: friendIdParamsSchema }),
  FriendController.deleteFriend
);

router.post('/accept/:friendID',
  authenticateToken,
  validateRequest({ params: friendIdParamsSchema }),
  FriendController.acceptFriendRequest
)

router.post('/reject/:friendID',
  authenticateToken,
  validateRequest({ params: friendIdParamsSchema }),
  FriendController.rejectFriendRequest
)
export default router;
