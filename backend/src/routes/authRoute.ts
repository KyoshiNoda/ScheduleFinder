import express from 'express';
import AuthController from '../controllers/AuthController';
const router = express.Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);

export default router;
