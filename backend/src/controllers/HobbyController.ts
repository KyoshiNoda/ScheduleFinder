import { Request, Response } from 'express';
import Hobby from '../models/hobbyModel';
import User from '../models/userModel';
import { toPrivateUser } from '../representations/userRepresentation';
import { HobbyBody, HobbyParams } from '../validation/schemas';

class HobbyController {
  // GET user's hobbies
  public static async getUserHobbies(req: Request, res: Response) {
    const userID: string = req.auth.userId;

    try {
      const user = await User.findOne({ _id: userID }).exec();

      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }

      res.status(200).json({ hobbies: user.hobbies });
    } catch (error) {
      res.status(500).send({
        message: `Error while getting hobbies for user with id: ${userID}`,
        error: error,
      });
    }
  }

  // PATCH user's hobbies
  public static async updateUserHobbies(
    req: Request<Record<string, never>, unknown, HobbyBody>,
    res: Response
  ) {
    try {
      const userID: string = req.auth.userId;
      const { name: newHobbyName } = req.body;
      let existingHobby = await Hobby.findOne({ name: newHobbyName });

      if (!existingHobby) {
        existingHobby = await Hobby.create({ name: newHobbyName });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { $addToSet: { hobbies: existingHobby.name } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        return res.status(404).json({
          message: `User ${userID} not found`,
        });
      }

      res.status(existingHobby.isNew ? 201 : 200).json(existingHobby);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // DELETE single user's hobby
  public static async deleteUserHobby(req: Request<HobbyParams>, res: Response) {
    const userID: string = req.auth.userId;
    const { name: hobbyName } = req.params;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { $pull: { hobbies: hobbyName } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }

      res.status(200).json(toPrivateUser(updatedUser));
    } catch (error) {
      res.status(500).send({
        message: `Error while deleting hobbie hobby for user with id: ${userID}`,
        error: error,
      });
    }
  }

  // DELETE all user's hobbies
  public static async clearUserHobbies(req: Request, res: Response) {
    const userID: string = req.auth.userId;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { $set: { hobbies: [] } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }

      res.status(200).json(toPrivateUser(updatedUser));
    } catch (error) {
      res.status(500).send({
        message: `Error while clearing hobbies for user with id: ${userID}`,
        error: error,
      });
    }
  }

  // GET all existing hobbies
  public static async getAllTags(req: any, res: any) {
    try {
      const allHobbies = await Hobby.find({});
      res.status(200).send(allHobbies);
    } catch (error) {
      res.status(500).json({ message: 'Error while getting hobbies', error: error });
    }
  }
}

export default HobbyController;
