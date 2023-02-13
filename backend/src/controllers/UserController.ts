import { Request, Response } from "express";
import User from "../models/userModal";
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
}

export default UserController;
