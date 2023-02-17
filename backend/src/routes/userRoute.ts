import express from 'express';
import UserController from '../controllers/UserController';
const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.delete('/:id', UserController.deleteUser);
router.patch('/:id', UserController.updateUser);

export default router;
