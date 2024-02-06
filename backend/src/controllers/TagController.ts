import { Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import Tag from '../models/tagModel';

class TagController {
  // GET user's tags by token
  public static async getUserTags(req: any, res: any) {}

  // PATCH user's tags by token
  public static async updateUserTags(req: any, res: any) {}

  // DELETE single user's tag by token
  public static async deleteUserTag(req: AudioNode, res: any) {}

  // DELETE all user's tags by token
  public static async clearUserTags(req: any, res: any) {}

  // GET all tags
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
      res.status(400).json({ message: 'Error while getting new tag name', error: 'Possible malformed request' });
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
