import express from 'express';
import UserController from '../controllers/UserController';
const router = express.Router();
router.get('/getUsers', UserController.getAllUsers);
router.post('/createUser',UserController.createUser);
export default router;

