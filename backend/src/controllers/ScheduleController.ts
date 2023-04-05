import { Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import Schedule, { TimeSlot } from '../models/scheduleModel';

class ScheduleController {
  // GET USER's Schedule by Token
  public static async getMySchedule(req: any, res: any) {
    const userID = req.user.data._id;
    const userSchedule = await Schedule.find(
      { user_id: userID },
      (err: Error, found: any) => {
        if (!err) {
          return found;
        } else {
          res.status(400).json(err);
        }
      }
    )
      .clone()
      .catch((err) => console.log(err));
    res.json(userSchedule);
  }
  // PATCH an existing schedule by Token
  public static async updateSchedule(req: any, res: any) {
    const userID = req.user.data;
    try {
      const schedule = await Schedule.findOneAndUpdate(
        { _id: req.params.id, user_id: userID },
        { ...req.body },
        { new: true }
      );
      res.status(200).send(schedule);
    } catch (error) {
      res
        .status(400)
        .json(`The update attempt to user ${req.params._id} has failed`);
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

  // GET single schedule by id
  public static async getScheduleById(req: Request, res: Response) {
    const id = req.params.id;
    const user = await Schedule.findById(id);
    res.json(user);
  }

  // POST new schedule
  public static async createSchedule(req: Request, res: Response) {
    const schedule = new Schedule({
      user_id: req.body.user_id,
      visibility: req.body.visibility,
      timeSlot: [],
    });
    schedule
      .save()
      .then((savedSchedule) => res.status(200).send(savedSchedule))
      .catch((err) => res.send(err));
  }

  // POST new time slot into existing schedule
  public static async insertTimeSlot(req: Request, res: Response) {
    const newTimeSlot: TimeSlot = {
      _id: new mongoose.Types.ObjectId(),
      day: req.body.day,
      category: req.body.category,
      title: req.body.title,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      color: req.body.color,
      location: req.body.location,
      professor: req.body.professor,
    };
    await Schedule.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { timeSlot: newTimeSlot } },
      { new: true }
    ).then(() => res.status(200).send(newTimeSlot));
  }

  // PATCH an existing time slot
  public static async updateTimeSlot(req: Request, res: Response) {
    const schedule = await Schedule.findOne(
      { _id: req.params.id },
      (err: Error, found: any) => {
        if (!err) {
          return found;
        }
      }
    ).clone();
    const timeSlotIndex = schedule?.timeSlot.findIndex(
      (timeSlot) => timeSlot._id == req.body._id
    )!;
    schedule!.timeSlot[timeSlotIndex] = {
      ...schedule?.timeSlot[timeSlotIndex],
      ...req.body,
    };
    await schedule?.save();
    res.status(200).send(schedule!.timeSlot[timeSlotIndex]);
  }

  // DELETE  a time slot
  public static async deleteTimeSlot(req: Request, res: Response) {
    const schedule = await Schedule.findOne(
      { _id: req.params.id },
      (err: Error, found: any) => {
        if (!err) {
          return found;
        } else {
          res.status(404).json({ error: 'Schedule not Found' });
        }
      }
    ).clone();

    let deletedTimeSlot = null;

    if (schedule && schedule.timeSlot) {
      deletedTimeSlot = schedule.timeSlot.find(
        (timeSlot) => timeSlot._id == req.body._id
      );
      console.log(deletedTimeSlot);

      schedule.timeSlot = schedule.timeSlot.filter(
        (deletedItem) => deletedItem._id != req.body._id
      );
    }
    await schedule?.save();
    res.send(deletedTimeSlot);
  }

  // DELETE an existing schedule
  public static async deleteScheduleByID(req: Request, res: Response) {
    const id = req.params.id;
    Schedule.findOneAndDelete({ _id: id }, (err: any, docs: any) => {
      if (err) {
        res.send(err);
      }

      res.status(200).send(docs);
    });
  }
}

export default ScheduleController;
