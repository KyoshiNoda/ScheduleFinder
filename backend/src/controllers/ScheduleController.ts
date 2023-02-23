import { Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import Schedule, { TimeSlot } from '../models/scheduleModel';
class ScheduleController {
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

  public static async getScheduleById(req: Request, res: Response) {
    const id = req.params.id;
    const user = await Schedule.findById(id);
    res.json(user);
  }

  public static async createSchedule(req: Request, res: Response) {
    const schedule = new Schedule({
      user_id: req.body.user_id,
      visibility: req.body.visibility,
      timeSlot: [],
    });
    schedule.save().then(() => console.log('schedule entry added'));
  }

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
      { $push: { timeSlot: newTimeSlot } }
    ).then(() => console.log('inserted'));
  }

  public static async updateSchedule(req: Request, res : Response){
    try {
      const schedule = await Schedule.findOneAndUpdate({ _id: req.params.id }, { ...req.body });
      res.json(schedule)
    } catch () {
      res.status(400).json(`The update attempt to user ${req.params._id} has failed`);
    }
  }

  public static async updateTimeSlot(req: Request, res : Response){
    const schedule  = await Schedule.findOne({_id : req.params.id},(err : Error,found : any) =>{
      if(!err){
       return found
      }
    }).clone()
    const timeSlotIndex = schedule?.timeSlot.findIndex((timeSlot) => timeSlot._id == req.body._id)!;
    schedule!.timeSlot[timeSlotIndex] = {
      ...schedule?.timeSlot[timeSlotIndex],
      ...req.body,
    }
    await schedule?.save();
    res.send("it worked!")
  }

  public static async deleteTimeSlot(req : Request, res : Response){
    const schedule  = await Schedule.findOne({_id : req.params.id},(err : Error,found : any) =>{
      if(!err){
       return found
      }
      else{
        res.status(404).json({error : "Schedule not Found"});
      }
    }).clone()
    if (schedule && schedule.timeSlot) {
      schedule.timeSlot = schedule.timeSlot.filter((deletedItem) => deletedItem._id != req.body._id);
    }
   await schedule?.save();
   res.send("deleted timeSlot");
  }

  public static async getScheduleByToken(req: any, res: any) {
    const user_ID: string = req.user.data._id;
    const user = await Schedule.find(
      { user_id: user_ID },
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
    res.json(user);
  }
  
  public static async deleteScheduleByID(req : Request, res : Response){
    const id = req.params.id;
    await Schedule.deleteOne({_id : id}, (err: Error, deleted : any) =>{
      if(!err){
        res.json(`schedule ${id} was deleted!`);
      }
      else{
        res.status(400).json(err);
      }
    }).clone().catch(err => console.log(err));
  }
}

export default ScheduleController;
