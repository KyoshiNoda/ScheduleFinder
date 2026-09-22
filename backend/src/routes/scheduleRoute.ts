import express from 'express';
import ScheduleController from '../controllers/ScheduleController';
import { authenticateToken } from '../auth/authenticateToken';

const router = express.Router();

router.get(
  '/mySchedule',
  authenticateToken,
  ScheduleController.getMySchedule
);

router.post('/:id', authenticateToken, ScheduleController.insertTimeSlot);

router.patch(
  '/:id',
  authenticateToken,
  ScheduleController.updateSchedule
);
router.patch(
  '/:id/timeSlot',
  authenticateToken,
  ScheduleController.updateTimeSlot
);

router.delete(
  '/:id',
  authenticateToken,
  ScheduleController.clearScheduleById
);
router.delete(
  '/:id/timeSlot',
  authenticateToken,
  ScheduleController.deleteTimeSlot
);

router.get('/:id/user', authenticateToken, ScheduleController.getScheduleByUserId);
router.get('/:id', authenticateToken, ScheduleController.getScheduleById);
router.post('/', authenticateToken, ScheduleController.createSchedule);

export default router;
