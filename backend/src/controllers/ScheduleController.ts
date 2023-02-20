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
  public static async getScheduleById(req : Request, res : Response) : Promise<any>{
    const id = req.params.id;
    const user = await Schedule.findById(id)
    res.json(user);
  }



  public static async getScheduleByToken(req: any, res: any): Promise<any> {
    const user_ID : string = req.user.data._id;
    const user = await Schedule.find({user_id: user_ID}, (err: any, found: any) => {
      if (!err) {
        return found;
      } else {
        throw err;
      }
    })
      .clone()
      .catch((err) => console.log(err));
      res.json(user)
  }
}

export default ScheduleController;
