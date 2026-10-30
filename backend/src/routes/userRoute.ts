import express from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken } from '../auth/authenticateToken';
import { parseProfileImage, requireImageProvider } from '../uploads/profileImageUpload';
import {
  changePasswordWithTokenBodySchema,
  idParamsSchema,
  updateUserBodySchema,
} from '../validation/schemas';
import { validateRequest } from '../validation/validateRequest';

const router = express.Router();
router.get('/', authenticateToken, UserController.getUserInfo);
router.patch(
  '/',
  authenticateToken,
  validateRequest({ body: updateUserBodySchema }),
  UserController.updateUser
);
router.patch('/image', authenticateToken, requireImageProvider, parseProfileImage, UserController.changeProfilePicture);
router.delete('/image', authenticateToken, UserController.deleteProfilePicture);
router.post(
  '/changePassword/token',
  authenticateToken,
  validateRequest({ body: changePasswordWithTokenBodySchema }),
  UserController.changePasswordWithToken
);
router.get('/allUsers', authenticateToken, UserController.getAllUsers);
router.get(
  '/:id',
  authenticateToken,
  validateRequest({ params: idParamsSchema }),
  UserController.getUserById
);

export default router;
