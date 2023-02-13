import { Request, Response } from "express";
import User from "../models/userModal";
import bcrypt from 'bcrypt';
class UserController {
  public static async getAllUsers(req: Request, res: Response): Promise<any> {
    await User.find({}, (err: any, found: any) => {
      if (!err) {
        res.send(found);
      } else {
        throw err;
      }
    }).clone().catch(err => console.log(err));
  }
  public static async getUserById(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    await User.find({_id : id}, (err: any, found: any) => {
      if (!err) {
        res.send(found);
      } else {
        throw err;
      }
    }).clone().catch(err => console.log(err));
  }

  public static async createUser(req : Request, res : Response) : Promise<any>{
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    const user = new User({
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email : req.body.email,
      password : hashedPassword,
      gender : req.body.gender,
      school : req.body.school
    });
    user.save().then(() =>{
      console.log("one entry added");
    })
    .catch((err) =>{
      console.log(err);
    });
  }
  public static async deleteUser(req: Request, res : Response){
    const id = req.params.id;
    await User.deleteOne({_id : id},(err : any, deleted : any) =>{
      if(!err){
        res.send(`user ${id} was deleted!`);
      }
      else{
        throw err;
      }
    }).clone().catch(err => console.log(err));
  }

  public static async updateFirstName(req : Request, res : Response){
    const id = req.params.id;
    const newFirstName = req.body.firstName;
    User.updateOne({_id : id},{
        $set : {firstName : newFirstName}
      },(err : any, updatedItem : any) =>{
        if(!err){
          res.send(`updated item ${id}`);
        }
        else{
          throw err;
        } 
      }
    ).clone().catch(err => console.log(err));
  }





}

export default UserController;
