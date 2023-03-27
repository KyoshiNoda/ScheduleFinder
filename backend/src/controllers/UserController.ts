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

  // POST new user
  public static async createUser(req: Request, res: Response): Promise<any> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      photoURL: req.body.photoURL,
      email: req.body.email,
      password: hashedPassword,
      gender: req.body.gender,
      school: req.body.school,
      major : req.body.major
    });

    user
      .save()
      .then((savedUser) => {
        res.status(200).send(savedUser);
      })
      .catch((err) => {
        res.send(err);
      });
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

  // PATCH user by id
  public static async updateUser(req: Request, res: Response) {
    const id = req.params.id;
    if (req.body.password) {
      const newPassword = req.body.password;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { ...req.body, password: hashedPassword },
        { returnOriginal: false }
      );
      res.status(200).json(updatedUser);
    } else {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: id },
          { ...req.body },
          { returnOriginal: false }
        );
        res.status(200).json(updatedUser);
      } catch (error) {
        res.json(`The update attempt to user ${id} has failed`);
      }
    }
  }
}

export default UserController;
