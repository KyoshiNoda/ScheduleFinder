import { Request, Response } from 'express';
import { Error } from 'mongoose';
import Schedule from '../models/scheduleModel';
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
}

export default ScheduleController;
