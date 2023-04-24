import express from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
const router = express.Router();

router.get('/',AuthController.authenticateToken,UserController.getUserInfo);
router.get('/allUsers', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.delete('/:id', UserController.deleteUser);
router.patch('/:id', UserController.updateUser);

export default router;
