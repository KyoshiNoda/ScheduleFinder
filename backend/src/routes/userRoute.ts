import express from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken } from '../auth/authenticateToken';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', authenticateToken, UserController.getUserInfo);
router.patch('/', authenticateToken, UserController.updateUser);
router.patch('/image', authenticateToken, upload.single('photoURL'), UserController.changeProfilePicture);
router.delete('/image', authenticateToken, UserController.deleteProfilePicture);
router.post('/changePassword/token', authenticateToken, UserController.changePasswordWithToken);
router.post('/changePassword', UserController.changePasswordWithoutToken);
router.get('/allUsers', authenticateToken, UserController.getAllUsers);
router.get('/:id', authenticateToken, UserController.getUserById);

export default router;
