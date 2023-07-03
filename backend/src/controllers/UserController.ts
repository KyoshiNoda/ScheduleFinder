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

  // DELETE user by by token
  public static async deleteUser(req: any, res: any) {
    const userID: string = req.user.data._id;

    const deletedUser = await User.findOneAndDelete({ _id: userID });

    if (!deletedUser) {
      return res.json({ error: `User with id ${userID} was not found` });
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
  public static async changePasswordWithToken(req: any, res: any) {
    try {
      const userID: string = req.user.data._id;
      const userPassword: string = req.user.data.password;
      const passwordMatch = await bcrypt.compare(
        req.body.currentPassword,
        userPassword
      );

      if (!passwordMatch) {
        res.status(401).send('Incorrect Password!');
        return;
      }
      if (req.body.newPassword !== req.body.confirmNewPassword) {
        res.status(401).send("Passwords don't match!'");
        return;
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { ...req.body, password: hashedPassword },
        { returnOriginal: false }
      );
      if (!updatedUser) {
        throw new Error('Error updating password');
      }
      res.status(200).send({ message: 'Password Changed!' });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }
  public static async changePasswordWithoutToken(req: Request, res: Response) {
    try {
      const user = await User.findOne({ email: req.body.email }).exec();
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      if (req.body.newPassword !== req.body.confirmNewPassword) {
        return res.status(401).send({ message: "Passwords don't match!" });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      const updatedUser = await User.findOneAndUpdate(
        { email: req.body.email },
        { ...req.body, password: hashedPassword },
        { returnOriginal: false }
      );

      if (!updatedUser) {
        throw new Error('Error updating password');
      }

      return res
        .status(200)
        .send({ message: 'Password Changed!', updatedUser });
    } catch (error: any) {
      return res.status(500).send({ error: 'Error occurred' });
    }
  }
}
export default UserController;
