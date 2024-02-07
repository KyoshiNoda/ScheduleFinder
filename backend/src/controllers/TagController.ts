import Tag from '../models/tagModel';
import User from '../models/userModel';

class TagController {
  // GET user's tags
  public static async getUserTags(req: any, res: any) {
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

  // PATCH user's tags
  public static async updateUserTags(req: any, res: any) {
    const userID: string = req.user.data._id;
    const { tagId } = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { $push: { hobbies: tagId } },
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

  // DELETE single user's tag
  public static async deleteUserTag(req: any, res: any) {
    const userID: string = req.user.data._id;
    const { id: tagId } = req.params;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { $pull: { hobbies: tagId } },
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
        message: `Error while deleting hobbie tag for user with id: ${userID}`,
        error: error,
      });
    }
  }

  // DELETE all user's tags
  public static async clearUserTags(req: any, res: any) {
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

  // GET all existing tags
  public static async getAllTags(req: any, res: any) {
    try {
      const allTags = await Tag.find({});
      res.status(200).send(allTags);
    } catch (error) {
      res.status(500).json({ message: 'Error while getting tags', error: error });
    }
  }

  // POST new tag
  public static async createTag(req: any, res: any) {
    const { name: newTagName } = req.body || null;
    if (newTagName === null) {
      res
        .status(400)
        .json({ message: 'Error while getting new tag name', error: 'Possible malformed request' });
    }

    try {
      const createdTag = await Tag.create({ name: newTagName });
      res.status(201).json(createdTag);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default TagController;
