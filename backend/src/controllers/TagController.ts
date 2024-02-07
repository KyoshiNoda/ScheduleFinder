import Hobby from '../models/hobbyModel';
import User from '../models/userModel';

class HobbyController {
  // GET user's hobbies
  public static async getUserHobbies(req: any, res: any) {
    const userID: string = req.user.data._id;

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
  public static async updateUserHobbies(req: any, res: any) {
    const userID: string = req.user.data._id;
    const { hobbyId } = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { $push: { hobbies: hobbyId } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send({
        message: `Error while updating hobbies for user with id: ${userID}`,
        error: error,
      });
    }
  }

  // DELETE single user's hobby
  public static async deleteUserHobby(req: any, res: any) {
    const userID: string = req.user.data._id;
    const { id: hobbyId } = req.params;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { $pull: { hobbies: hobbyId } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send({
        message: `Error while deleting hobbie hobby for user with id: ${userID}`,
        error: error,
      });
    }
  }

  // DELETE all user's hobbies
  public static async clearUserHobbies(req: any, res: any) {
    const userID: string = req.user.data._id;

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

      res.status(200).json(updatedUser);
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

  // POST new hobby
  public static async createHobby(req: any, res: any) {
    const { name: newHobbyName } = req.body || null;
    if (newHobbyName === null) {
      res
        .status(400)
        .json({ message: 'Error while getting new hobby name', error: 'Possible malformed request' });
    }

    try {
      const lowerCaseHobbyName = newHobbyName.toLowerCase();
      const createdHobby = await Hobby.create({ name: lowerCaseHobbyName });
      res.status(201).json(createdHobby);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default HobbyController;
