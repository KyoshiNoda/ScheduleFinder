import { Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import Schedule, { TimeSlot } from '../models/scheduleModel';
class ScheduleController {
  public static async getAllSchedules(
    req: Request,
    res: Response
  ): Promise<any> {
    await Schedule.find({}, (err: Error, result: any) => {
      if (!err) {
        res.send(result);
      } else {
        throw err;
      }
    })
      .clone()
      .catch((err) => console.log(err));
  }
  public static async getScheduleById(
    req: Request,
    res: Response
  ): Promise<any> {
    const id = req.params.id;
    const user = await Schedule.findById(id);
    res.json(user);
  }
  public static async createSchedule(
    req: Request,
    res: Response
  ): Promise<any> {
    const schedule = new Schedule({
      user_id: req.body.user_id,
      visibility: req.body.visibility,
      timeSlot: [],
    });
    schedule.save().then(() => console.log('schedule entry added'));
  }
  public static async insertTimeSlot(
    req: Request,
    res: Response
  ): Promise<any> {
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
    Schedule.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { timeSlot: newTimeSlot } }
    ).then(() => console.log('inserted'));
  }

  public static async getScheduleByToken(req: any, res: any): Promise<any> {
    const user_ID: string = req.user.data._id;
    const user = await Schedule.find(
      { user_id: user_ID },
      (err: any, found: any) => {
        if (!err) {
          return found;
        } else {
          throw err;
        }
      }
    )
      .clone()
      .catch((err) => console.log(err));
    res.json(user);
  }
}

export default ScheduleController;
