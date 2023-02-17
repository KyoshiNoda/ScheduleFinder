import express from 'express';
import AuthController from '../controllers/AuthController';
import ScheduleController from '../controllers/ScheduleController';
const router = express.Router();
router.post('/login', AuthController.loginUser);
// router.get('/schedule', AuthController.authToken, ScheduleController.getAllSchedules);

export default router;