import express from 'express';
import ScheduleController from '../controllers/ScheduleController';
const router = express.Router();
router.get('/getSchedules', ScheduleController.getAllSchedules);

export default router;