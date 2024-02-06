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
    res.send('GET All tags working!');
  }

  // POST new tag
  public static async createTag(req: any, res: any) {}
}

export default TagController;
