import express from 'express';
import UserController from '../controllers/UserController';
const router = express.Router();

router.get('/getUsers', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/createUser', UserController.createUser);
router.delete('/:id', UserController.deleteUser);

router.patch('/user/:id', UserController.updateUser);

export default router;