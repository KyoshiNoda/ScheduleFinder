import express from 'express';
import FriendController from '../controllers/FriendController';
import { authenticateToken } from '../auth/authenticateToken';
const router = express.Router();

router.get('/',
  authenticateToken,
  FriendController.getFriends
);

router.delete(
  '/:friendID',
  authenticateToken,
  FriendController.deleteFriend
);

router.post('/accept/:friendID',
  authenticateToken,
  FriendController.acceptFriendRequest
)

router.post('/reject/:friendID',
  authenticateToken,
  FriendController.rejectFriendRequest
)
export default router;
