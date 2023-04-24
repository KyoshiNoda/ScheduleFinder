import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';

class UserController {
  // GET all user
  public static async getAllUsers(req: Request, res: Response): Promise<any> {
    await User.find({}, (err: any, found: any) => {
      if (!err) {
        res.send(found);
      } else {
        throw err;
      }
    })
      .clone()
      .catch((err) => console.log(err));
  }
  // GET userInfo with Token
  public static async getUserInfo(req: any, res: any) {
    const userID: string = req.user.data._id;
    try {
      const user = await User.find({ _id: userID }).exec();
      if (!user) {
        return res.status(404).json({
          message: `User ${userID} not found`,
        });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  // GET single user by id
  public static async getUserById(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    await User.find({ _id: id }, (err: any, found: any) => {
      if (!err) {
        res.send(found);
      } else {
        throw err;
      }
    })
      .clone()
      .catch((err) => console.log(err));
  }

  // DELETE user by id
  public static async deleteUser(req: Request, res: Response) {
    const id = req.params.id;

    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      return res.json({ error: `User with id ${id} was not found` });
    }

    res.status(200).json(deletedUser);
  }

  // PATCH user by Token
  public static async updateUser(req: any, res: any) {
    const userID: string = req.user.data._id;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { ...req.body },
        { returnOriginal: false }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.json(`The update attempt to user ${userID} has failed`);
    }
  }
  // change password with Token
  public static async changePassword(req: any, res: any) {
    const userID: string = req.user.data._id;
    const userPassword: string = req.user.data.password;
    const passwordMatch = await bcrypt.compare(req.body.currentPassword, userPassword);

    if (!passwordMatch) {
      res.status(401).send('Incorrect Password!');
    }
    if (req.body.newPassword !== req.body.confirmNewPassword) {
      res.status(401).send("Passwords dont match!'");
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    await User.findOneAndUpdate(
      { _id: userID },
      { ...req.body, password: hashedPassword },
      { returnOriginal: false }
    );
    res.status(200).send({ message: 'Password Changed!' });
  }
}
export default UserController;
