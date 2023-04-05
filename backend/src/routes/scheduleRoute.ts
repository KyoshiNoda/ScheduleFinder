import express from 'express';
import ScheduleController from '../controllers/ScheduleController';
import AuthController from '../controllers/AuthController';
const router = express.Router();
router.get('/', ScheduleController.getAllSchedules);
router.get('/mySchedule',AuthController.authenticateToken,ScheduleController.getMySchedule);
router.get('/:id',ScheduleController.getScheduleById);

router.post('/',ScheduleController.createSchedule);
router.post('/:id',ScheduleController.insertTimeSlot);

router.patch('/:id',AuthController.authenticateToken,ScheduleController.updateSchedule);
router.patch('/:id/timeSlot',ScheduleController.updateTimeSlot);

router.delete('/:id',AuthController.authenticateToken,ScheduleController.deleteScheduleByID);
router.delete('/:id/timeSlot',ScheduleController.deleteTimeSlot);
export default router;
