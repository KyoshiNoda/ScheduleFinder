import express from 'express';
import ScheduleController from '../controllers/ScheduleController';
import AuthController from '../controllers/AuthController';
const router = express.Router();
router.get('/', ScheduleController.getAllSchedules);
router.get('/userSchedule', AuthController.authToken,ScheduleController.getScheduleByToken)
router.get('/:id',ScheduleController.getScheduleById);

router.post('/',ScheduleController.createSchedule);
router.post('/:id',ScheduleController.insertTimeSlot);

export default router;
