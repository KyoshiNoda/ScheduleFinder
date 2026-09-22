import express from 'express';
import ScheduleController from '../controllers/ScheduleController';
import { authenticateToken } from '../auth/authenticateToken';
import {
  createTimeSlotBodySchema,
  deleteTimeSlotBodySchema,
  emptyBodySchema,
  idParamsSchema,
  updateScheduleBodySchema,
  updateTimeSlotBodySchema,
} from '../validation/schemas';
import { validateRequest } from '../validation/validateRequest';

const router = express.Router();

router.get(
  '/mySchedule',
  authenticateToken,
  ScheduleController.getMySchedule
);

router.post(
  '/:id',
  authenticateToken,
  validateRequest({ params: idParamsSchema, body: createTimeSlotBodySchema }),
  ScheduleController.insertTimeSlot
);

router.patch(
  '/:id',
  authenticateToken,
  validateRequest({ params: idParamsSchema, body: updateScheduleBodySchema }),
  ScheduleController.updateSchedule
);
router.patch(
  '/:id/timeSlot',
  authenticateToken,
  validateRequest({ params: idParamsSchema, body: updateTimeSlotBodySchema }),
  ScheduleController.updateTimeSlot
);

router.delete(
  '/:id',
  authenticateToken,
  validateRequest({ params: idParamsSchema }),
  ScheduleController.clearScheduleById
);
router.delete(
  '/:id/timeSlot',
  authenticateToken,
  validateRequest({ params: idParamsSchema, body: deleteTimeSlotBodySchema }),
  ScheduleController.deleteTimeSlot
);

router.get(
  '/:id/user',
  authenticateToken,
  validateRequest({ params: idParamsSchema }),
  ScheduleController.getScheduleByUserId
);
router.get(
  '/:id',
  authenticateToken,
  validateRequest({ params: idParamsSchema }),
  ScheduleController.getScheduleById
);
router.post(
  '/',
  authenticateToken,
  validateRequest({ body: emptyBodySchema }),
  ScheduleController.createSchedule
);

export default router;
