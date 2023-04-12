import express from 'express';
import ScheduleController from '../controllers/ScheduleController';
import AuthController from '../controllers/AuthController';
const router = express.Router();
router.get(
  '/mySchedule',
  AuthController.authenticateToken,
  ScheduleController.getMySchedule
);

router.post(
  '/:id',
  AuthController.authenticateToken,
  ScheduleController.insertTimeSlot
);

router.patch(
  '/:id',
  AuthController.authenticateToken,
  ScheduleController.updateSchedule
);
router.patch(
  '/:id/timeSlot',
  AuthController.authenticateToken,
  ScheduleController.updateTimeSlot
);

router.delete(
  '/:id',
  AuthController.authenticateToken,
  ScheduleController.deleteScheduleByID
);
router.delete(
  '/:id/timeSlot',
  AuthController.authenticateToken,
  ScheduleController.deleteTimeSlot
);


router.get('/', ScheduleController.getAllSchedules);
router.get('/:id', ScheduleController.getScheduleById);
router.post('/', ScheduleController.createSchedule);



export default router;
