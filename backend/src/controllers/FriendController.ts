import { Request, Response } from 'express';
import User from '../models/userModel';
class FriendController {
  public static async getFriends(req: any, res: any) {
    const userID: string = req.user.data._id;
    try {
      const user = await User.findOne({ _id: userID }).exec();
      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }
      res.send(user.friends);
    } catch (err) {
      console.error(err);
      res.status(500).ssend({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }
}

export default FriendController;
