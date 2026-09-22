import express from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken } from '../auth/authenticateToken';
import multer from 'multer';
import {
  changePasswordWithoutTokenBodySchema,
  changePasswordWithTokenBodySchema,
  idParamsSchema,
  updateUserBodySchema,
} from '../validation/schemas';
import { validateRequest } from '../validation/validateRequest';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', authenticateToken, UserController.getUserInfo);
router.patch(
  '/',
  authenticateToken,
  validateRequest({ body: updateUserBodySchema }),
  UserController.updateUser
);
router.patch('/image', authenticateToken, upload.single('photoURL'), UserController.changeProfilePicture);
router.delete('/image', authenticateToken, UserController.deleteProfilePicture);
router.post(
  '/changePassword/token',
  authenticateToken,
  validateRequest({ body: changePasswordWithTokenBodySchema }),
  UserController.changePasswordWithToken
);
router.post(
  '/changePassword',
  validateRequest({ body: changePasswordWithoutTokenBodySchema }),
  UserController.changePasswordWithoutToken
);
router.get('/allUsers', authenticateToken, UserController.getAllUsers);
router.get(
  '/:id',
  authenticateToken,
  validateRequest({ params: idParamsSchema }),
  UserController.getUserById
);

export default router;
