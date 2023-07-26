import express from 'express';
import FriendController from '../controllers/FriendController';
import AuthController from '../controllers/AuthController';
const router = express.Router();

router.get('/', 
  AuthController.authenticateToken, 
  FriendController.getFriends
);

router.delete(
  '/:friendID',
  AuthController.authenticateToken,
  FriendController.deleteFriend
);

router.post('/accept/:friendID',
  AuthController.authenticateToken,
  FriendController.acceptFriendRequest
)

router.post('/reject/:friendID',
  AuthController.authenticateToken,
  FriendController.rejectFriendRequest
)
export default router;
