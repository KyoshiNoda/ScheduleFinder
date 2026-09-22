import { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import Schedule, { ISchedule, TimeSlot } from '../models/scheduleModel';
import {
  CreateTimeSlotBody,
  DAYS_OF_WEEK,
  DeleteTimeSlotBody,
  IdParams,
  parseTimeToMinutes,
  UpdateScheduleBody,
  UpdateTimeSlotBody,
} from '../validation/schemas';
import { sendValidationError } from '../validation/validateRequest';

class ScheduleController {
  private static timeSlotsOverlap(
    candidate: Omit<TimeSlot, '_id'>,
    timeSlots: TimeSlot[],
    excludedTimeSlotID?: string
  ): boolean {
    const candidateStart = parseTimeToMinutes(candidate.startTime);
    const candidateEnd = parseTimeToMinutes(candidate.endTime);

    return timeSlots.some((timeSlot) => {
      if (excludedTimeSlotID && timeSlot._id.toString() === excludedTimeSlotID) {
        return false;
      }

      const sharesDay = DAYS_OF_WEEK.some(
        (day) => candidate.days[day] && timeSlot.days?.[day]
      );

      if (!sharesDay) {
        return false;
      }

      const existingStart = parseTimeToMinutes(timeSlot.startTime);
      const existingEnd = parseTimeToMinutes(timeSlot.endTime);

      if ([candidateStart, candidateEnd, existingStart, existingEnd].some(Number.isNaN)) {
        return false;
      }

      return candidateStart < existingEnd && existingStart < candidateEnd;
    });
  }

  private static async getOwnedSchedule(
    scheduleID: string,
    userID: string,
    res: Response
  ): Promise<ISchedule | null> {
    const schedule = await Schedule.findById(scheduleID);

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return null;
    }

    if (schedule.user_id !== userID) {
      res.status(403).json({ error: 'Forbidden' });
      return null;
    }

    return schedule;
  }

  public static async getMySchedule(req: Request, res: Response) {
    const userID = req.auth.userId;

    try {
      const schedule = await Schedule.findOne({ user_id: userID }).exec();

      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      return res.status(200).send(schedule);
    } catch {
      return res.status(500).json({ error: 'Unable to retrieve schedule' });
    }
  }

  public static async updateSchedule(
    req: Request<IdParams, unknown, UpdateScheduleBody>,
    res: Response
  ) {
    const userID = req.auth.userId;
    const scheduleID = req.params.id;

    try {
      const schedule = await ScheduleController.getOwnedSchedule(scheduleID, userID, res);

      if (!schedule) {
        return;
      }

      schedule.visibility = req.body.visibility;
      await schedule.save();

      return res.status(200).send(schedule);
    } catch {
      return res.status(400).json({ error: 'Unable to update schedule' });
    }
  }

  public static async clearScheduleById(req: Request<IdParams>, res: Response) {
    const userID = req.auth.userId;
    const scheduleID = req.params.id;

    try {
      const schedule = await ScheduleController.getOwnedSchedule(scheduleID, userID, res);

      if (!schedule) {
        return;
      }

      schedule.timeSlots = [];
      await schedule.save();

      return res.status(200).send(schedule);
    } catch {
      return res.status(400).json({ error: 'Unable to clear schedule' });
    }
  }

  public static async insertTimeSlot(
    req: Request<IdParams, unknown, CreateTimeSlotBody>,
    res: Response
  ) {
    const userID = req.auth.userId;
    const scheduleID = req.params.id;

    try {
      const schedule = await ScheduleController.getOwnedSchedule(scheduleID, userID, res);

      if (!schedule) {
        return;
      }

      const newTimeSlot: TimeSlot = {
        _id: new mongoose.Types.ObjectId(),
        days: req.body.days,
        title: req.body.title,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        color: req.body.color,
        location: req.body.location,
        professor: req.body.professor,
      };

      if (ScheduleController.timeSlotsOverlap(newTimeSlot, schedule.timeSlots)) {
        return sendValidationError(res, [
          {
            path: 'body.startTime',
            message: 'Time slot overlaps an existing slot on a selected day.',
          },
        ]);
      }

      schedule.timeSlots.push(newTimeSlot);
      await schedule.save();

      return res.status(200).send(newTimeSlot);
    } catch {
      return res.status(400).json({ error: 'Unable to add time slot' });
    }
  }

  public static async updateTimeSlot(
    req: Request<IdParams, unknown, UpdateTimeSlotBody>,
    res: Response
  ) {
    const userID = req.auth.userId;
    const scheduleID = req.params.id;

    try {
      const schedule = await ScheduleController.getOwnedSchedule(scheduleID, userID, res);

      if (!schedule) {
        return;
      }

      const timeSlotIndex = schedule.timeSlots.findIndex(
        (timeSlot) => timeSlot._id.toString() === req.body._id
      );

      if (timeSlotIndex < 0) {
        return res.status(404).json({ error: 'Time slot not found' });
      }

      const existingTimeSlot = schedule.timeSlots[timeSlotIndex];
      const updatedTimeSlot: TimeSlot = {
        _id: existingTimeSlot._id,
        days: req.body.days ?? existingTimeSlot.days,
        title: req.body.title ?? existingTimeSlot.title,
        startTime: req.body.startTime ?? existingTimeSlot.startTime,
        endTime: req.body.endTime ?? existingTimeSlot.endTime,
        color: req.body.color ?? existingTimeSlot.color,
        location:
          req.body.location !== undefined ? req.body.location : existingTimeSlot.location,
        professor:
          req.body.professor !== undefined ? req.body.professor : existingTimeSlot.professor,
      };

      if (
        parseTimeToMinutes(updatedTimeSlot.startTime) >=
        parseTimeToMinutes(updatedTimeSlot.endTime)
      ) {
        return sendValidationError(res, [
          { path: 'body.startTime', message: 'Start time must be before end time.' },
        ]);
      }

      if (
        ScheduleController.timeSlotsOverlap(
          updatedTimeSlot,
          schedule.timeSlots,
          existingTimeSlot._id.toString()
        )
      ) {
        return sendValidationError(res, [
          {
            path: 'body.startTime',
            message: 'Time slot overlaps an existing slot on a selected day.',
          },
        ]);
      }

      schedule.timeSlots[timeSlotIndex] = updatedTimeSlot;
      await schedule.save();

      return res.status(200).send(schedule.timeSlots[timeSlotIndex]);
    } catch {
      return res.status(400).json({ error: 'Unable to update time slot' });
    }
  }

  public static async deleteTimeSlot(
    req: Request<IdParams, unknown, DeleteTimeSlotBody>,
    res: Response
  ) {
    const userID = req.auth.userId;
    const scheduleID = req.params.id;

    try {
      const schedule = await ScheduleController.getOwnedSchedule(scheduleID, userID, res);

      if (!schedule) {
        return;
      }

      const timeSlotId = req.body._id;
      const deletedTimeSlot = schedule.timeSlots.find(
        (timeSlot) => timeSlot._id.toString() === timeSlotId
      );

      if (!deletedTimeSlot) {
        return res.status(404).json({ error: 'Time slot not found' });
      }

      schedule.timeSlots = schedule.timeSlots.filter(
        (timeSlot) => timeSlot._id.toString() !== timeSlotId
      );
      await schedule.save();

      return res.status(200).send(deletedTimeSlot);
    } catch {
      return res.status(500).json({ error: 'Unable to delete time slot' });
    }
  }

  public static async getScheduleById(req: Request<IdParams>, res: Response) {
    try {
      const schedule = await ScheduleController.getOwnedSchedule(
        req.params.id,
        req.auth.userId,
        res
      );

      if (!schedule) {
        return;
      }

      return res.status(200).send(schedule);
    } catch {
      return res.status(400).json({ error: 'Unable to retrieve schedule' });
    }
  }

  public static async getScheduleByUserId(req: Request<IdParams>, res: Response) {
    const requestingUserID = req.auth.userId;

    try {
      const schedule = await Schedule.findOne({ user_id: req.params.id });

      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      if (schedule.user_id !== requestingUserID && schedule.visibility !== 'public') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      return res.status(200).send(schedule);
    } catch {
      return res.status(400).json({ error: 'Unable to retrieve schedule' });
    }
  }

  public static async createSchedule(req: Request, res: Response) {
    try {
      const schedule = await Schedule.create({
        user_id: req.auth.userId,
        visibility: 'public',
        timeSlots: [],
      });

      return res.status(200).send(schedule);
    } catch {
      return res.status(400).json({ error: 'Unable to create schedule' });
    }
  }
}

export default ScheduleController;
