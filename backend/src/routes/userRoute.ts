import express from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', AuthController.authenticateToken, UserController.getUserInfo);
router.patch('/', AuthController.authenticateToken, UserController.updateUser);
router.patch('/image', AuthController.authenticateToken, upload.single('photoURL'), UserController.changeProfilePicture);
router.delete('/image', AuthController.authenticateToken, UserController.deleteProfilePicture);
router.post('/changePassword/token', AuthController.authenticateToken, UserController.changePasswordWithToken);
router.post('/changePassword', UserController.changePasswordWithoutToken);
router.get('/allUsers', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.delete('/:id', UserController.deleteUser);

export default router;
