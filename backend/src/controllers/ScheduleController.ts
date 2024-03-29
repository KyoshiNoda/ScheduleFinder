import { Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import Schedule, { TimeSlot } from '../models/scheduleModel';

class ScheduleController {
  // GET USER's Schedule by Token
  public static async getMySchedule(req: any, res: any) {
    const userID: string = req.user.data._id;
    try {
      const userSchedule = await Schedule.findOne({ user_id: userID }).exec();
      if (!userSchedule) {
        return res.status(404).json({
          message: `Schedule for user ${userID} not found`,
        });
      }
      res.json(userSchedule);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Error while getting schedule for user ${userID}`,
        error: err,
      });
    }
  }

  // PATCH an existing schedule by Token
  public static async updateSchedule(req: any, res: any) {
    const userID: string = req.user.data._id;
    const scheduleID: string = req.params.id;
    try {
      const schedule = await Schedule.findOneAndUpdate(
        { _id: scheduleID, user_id: userID },
        { ...req.body },
        { new: true }
      );
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.status(200).send(schedule);
    } catch (error) {
      res.status(400).send({
        error: `The update attempt to schedule ${scheduleID} has failed`,
      });
    }
  }

  // DELETE all time slots in a schedule using JWT
  public static async clearScheduleById(req: any, res: any) {
    const userID: string = req.user.data._id;
    const scheduleID: string = req.params.id;
    
    try {
      const schedule = await Schedule.findOneAndUpdate(
        {
          _id: scheduleID,
          user_id: userID,
        },
        {
          $set: { timeSlots: [] },
        },
        { new: true }
      );

      if (!schedule) {
        return res.status(404).json(`No schedule found with ID ${scheduleID} for user ${userID}`);
      }

      res.status(200).send(schedule);
    } catch (error) {
      res.status(400).json(`Failed to update schedule with ID ${scheduleID} for user ${userID}`);
    }
  }

  // POST new time slot into existing schedule
  public static async insertTimeSlot(req: any, res: any) {
    // const userID: string = req.user.data._id;
    const scheduleID: string = req.params.id;
    if (
      !(
        req.body.title &&
        req.body.startTime &&
        req.body.endTime &&
        req.body.color &&
        req.body.days
      )
    ) {
      return res.status(400).json({ message: 'Missing required properties' });
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
    try {
      const schedule = await Schedule.findOneAndUpdate(
        { _id: scheduleID },
        { $push: { timeSlots: newTimeSlot } },
        { new: true }
      );
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      res.status(200).send(newTimeSlot);
    } catch (error) {
      res.status(400).json(`${error}`);
    }
  }

  // PATCH an existing time slot
  public static async updateTimeSlot(req: any, res: any) {
    const userID = req.user.data._id;
    const scheduleID = req.params.id;
    try {
      const schedule = await Schedule.findOne(
        { _id: scheduleID, user_id: userID },
        (err: Error, found: any) => {
          if (!err) {
            return found;
          }
        }
      ).clone();
      if (!schedule) {
        return res
          .status(404)
          .json(`Schedule not found for user with ID ${userID}`);
      }
      const timeSlotIndex: number = schedule?.timeSlots.findIndex(
        (timeSlot) => timeSlot._id == req.body._id
      )!;

      if (timeSlotIndex < 0) {
        return res
          .status(404)
          .json(`Time slot with ID ${req.body._id} not found in schedule`);
      }
      schedule!.timeSlots[timeSlotIndex] = {
        ...schedule?.timeSlots[timeSlotIndex],
        ...req.body,
      };
      await schedule?.save();
      res.status(200).send(schedule!.timeSlots[timeSlotIndex]);
    } catch (error) {
      res.status(400).json(`${error}`);
    }
  }

  // DELETE  a time slot
  public static async deleteTimeSlot(req: any, res: any) {
    const userID = req.user.data._id;
    const scheduleID = req.params.id;
    try {
      const schedule = await Schedule.findOne({
        _id: scheduleID,
        user_id: userID,
      }).clone();

      if (!schedule) {
        res.status(404).json({ error: 'Schedule not found' });
        return;
      }

      const timeSlotId = req.body._id;
      const deletedTimeSlot = schedule.timeSlots.find(
        (timeSlot) => timeSlot._id.toString() === timeSlotId
      );

      if (!deletedTimeSlot) {
        res.status(404).json({ error: 'Time slot not found' });
        return;
      }

      schedule.timeSlots = schedule.timeSlots.filter(
        (timeSlot) => timeSlot._id.toString() !== timeSlotId
      );

      await schedule.save();
      res.status(200).send(deletedTimeSlot);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET all schedules
  public static async getAllSchedules(req: Request, res: Response) {
    await Schedule.find({}, (err: Error, result: any) => {
      if (!err) {
        res.send(result);
      } else {
        res.status(404).json(err);
      }
    })
      .clone()
      .catch((err) => console.log(err));
  }

  // GET single schedule by schedule id
  public static async getScheduleById(req: Request, res: Response) {
    const id = req.params.id;
    const schedule = await Schedule.findById(id);
    res.json(schedule);
  }

  // GET single schedule by user id
  public static async getScheduleByUserId(req: Request, res: Response) {
    // This is the user's id
    const id = req.params.id;

    try {
      const schedule = await Schedule.findOne({ user_id: id });
      res.send(schedule);
    } catch (error) {
      res.send({ message: 'Error retrieving schedule' });
    }
  }

  // POST new schedule
  public static async createSchedule(req: Request, res: Response) {
    const schedule = new Schedule({
      user_id: req.body.user_id,
      visibility: 'public',
      timeSlots: [],
    });
    schedule
      .save()
      .then((savedSchedule) => res.status(200).send(savedSchedule))
      .catch((err) => res.send(err));
  }
}

export default ScheduleController;
