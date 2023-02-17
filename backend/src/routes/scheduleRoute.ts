import express from 'express';
import ScheduleController from '../controllers/ScheduleController';
import AuthController from '../controllers/AuthController';
const router = express.Router();
router.get('/', ScheduleController.getAllSchedules);
router.get('/getSchedule', AuthController.authToken,ScheduleController.getScheduleByToken)

export default router;
