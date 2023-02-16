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
    await User.find({ _id: id }, (err: any, found: any) => {
      if (!err) {
        res.send(found);
      } else {
        throw err;
      }
    }).clone().catch(err => console.log(err));
  }

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
      school: req.body.school
    });
    user.save().then(() => {
      console.log("one entry added");
    })
      .catch((err) => {
        console.log(err);
      });
  }
  public static async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    await User.deleteOne({ _id: id }, (err: any, deleted: any) => {
      if (!err) {
        res.send(`user ${id} was deleted!`);
      }
      else {
        throw err;
      }
    }).clone().catch(err => console.log(err));
  }

  public static async updateFirstName(req: Request, res: Response) {
    const id = req.params.id;
    const newFirstName = req.body.firstName;
    User.updateOne({ _id: id }, {
      $set: { firstName: newFirstName }
    }, (err: any, updatedItem: any) => {
      if (!err) {
        res.send(`updated item ${id}`);
      }
      else {
        throw err;
      }
    }
    ).clone().catch(err => console.log(err));
  }
  public static async updateLastName(req: Request, res: Response) {
    const id = req.params.id;
    const newLastName = req.body.lastName;
    User.updateOne({ _id: id }, {
      $set: { lastName: newLastName }
    }, (err: any, updatedItem: any) => {
      if (!err) {
        res.send(`updated item ${id}`);
      }
      else {
        throw err;
      }
    }
    ).clone().catch(err => console.log(err));
  }
  public static async updateEmail(req: Request, res: Response) {
    const id = req.params.id;
    const newEmail = req.body.email;
    User.updateOne({ _id: id }, {
      $set: { email: newEmail }
    }, (err: any, updatedItem: any) => {
      if (!err) {
        res.send(`change email at ${id}`);
      }
      else {
        throw err;
      }
    }
    ).clone().catch(err => console.log(err));
  }
  public static async updatePassword(req: Request, res: Response) {
    const newPassword = req.body.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const id = req.params.id;
    User.updateOne({ _id: id }, {
      $set: { password: hashedPassword }
    }, (err: any, updatedItem: any) => {
      if (!err) {
        res.send(`updated password on item ${id}`);
      }
      else {
        throw err;
      }
    }
    ).clone().catch(err => console.log(err));
  }
  public static async updateGender(req: Request, res: Response) {
    const id = req.params.id;
    const newGender = req.body.gender;
    User.updateOne({ _id: id }, {
      $set: { gender: newGender }
    }, (err: any, updatedItem: any) => {
      if (!err) {
        res.send(`changed gender at ${id}`);
      }
      else {
        throw err;
      }
    }
    ).clone().catch(err => console.log(err));
  }
  public static async updateSchool(req: Request, res: Response) {
    const id = req.params.id;
    const newSchool = req.body.school;
    User.updateOne({ _id: id }, {
      $set: { school: newSchool }
    }, (err: any, updatedItem: any) => {
      if (!err) {
        res.send(`changed school at ${id}`);
      }
      else {
        throw err;
      }
    }
    ).clone().catch(err => console.log(err));
  }

  public static async updateAge(req: Request, res: Response) {
    const id = req.params.id;
    const newAge = req.body.age;
    User.updateOne({ _id: id }, {
      $set: { age: newAge }
    }, (err: any, updatedItem: any) => {
      if (!err) {
        res.send(`changed Age at ${id}`);
      }
      else {
        throw err;
      }
    }
    ).clone().catch(err => console.log(err));
  }

  public static async updatePhoto(req: Request, res: Response) {
    const id = req.params.id;
    const newPhotoURL = req.body.photoURL;
    User.updateOne({ _id: id }, {
      $set: { photoURL: newPhotoURL }
    }, (err: any, updatedItem: any) => {
      if (!err) {
        res.send(`changed photoURL at ${id}`);
      }
      else {
        throw err;
      }
    }
    ).clone().catch(err => console.log(err));
  }
}

export default UserController;
