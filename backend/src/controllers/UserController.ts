import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import {
  toPrivateUser,
  toPublicUser,
} from '../representations/userRepresentation';
import {
  ChangePasswordWithoutTokenBody,
  ChangePasswordWithTokenBody,
  IdParams,
  UpdateUserBody,
} from '../validation/schemas';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const defaultProfilePicture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s';

class UserController {
  // GET all user
  public static async getAllUsers(req: Request, res: Response): Promise<any> {
    await User.find({}, (err: any, found: any) => {
      if (!err) {
        res.send(found.map(toPublicUser));
      } else {
        throw err;
      }
    })
      .clone()
      .catch((err) => console.log(err));
  }
  // GET userInfo with Token
  public static async getUserInfo(req: Request, res: Response) {
    const userID: string = req.auth.userId;
    try {
      const user = await User.findOne({ _id: userID }).exec();
      if (!user) {
        return res.status(404).json({
          message: `User ${userID} not found`,
        });
      }
      res.json(toPrivateUser(user));
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  // GET single user by id
  public static async getUserById(req: Request<IdParams>, res: Response): Promise<any> {
    const id = req.params.id;
    await User.findOne({ _id: id }, (err: any, found: any) => {
      if (!err) {
        res.send(found ? toPublicUser(found) : found);
      } else {
        throw err;
      }
    })
      .clone()
      .catch((err) => console.log(err));
  }

  // PATCH user by Token
  public static async updateUser(
    req: Request<Record<string, never>, unknown, UpdateUserBody>,
    res: Response
  ) {
    const userID: string = req.auth.userId;

    try {
      const updates: UpdateUserBody = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { $set: updates },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(toPrivateUser(updatedUser));
    } catch {
      return res.status(500).json({ error: 'Unable to update user' });
    }
  }
  // change password with Token
  public static async changePasswordWithToken(
    req: Request<Record<string, never>, unknown, ChangePasswordWithTokenBody>,
    res: Response
  ) {
    try {
      const userID: string = req.auth.userId;
      const user = await User.findById(userID).select('+password');

      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(req.body.currentPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).send('Incorrect Password!');
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      const updatedUser = await User.findOneAndUpdate(
        { _id: userID },
        { password: hashedPassword },
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
  public static async changePasswordWithoutToken(
    req: Request<Record<string, never>, unknown, ChangePasswordWithoutTokenBody>,
    res: Response
  ) {
    try {
      const user = await User.findOne({ email: req.body.email }).exec();
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      const updatedUser = await User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('Error updating password');
      }

      return res.status(200).send({
        message: 'Password Changed!',
        updatedUser: toPrivateUser(updatedUser),
      });
    } catch (error: any) {
      return res.status(500).send({ error: 'Error occurred' });
    }
  }

  public static async changeProfilePicture(req: Request, res: Response) {
    const userID: string = req.auth.userId;
    try {
      const uploadedFile = req.file!;
      const fileBuffer = uploadedFile.buffer;
      const fileData = fileBuffer.toString('base64');
      const user = await User.findOne({ _id: userID }).exec();
      if (!user) {
        return res.status(404).json({
          message: `User ${userID} not found`,
        });
      }

      if (user?.photoURL !== defaultProfilePicture) {
        const publicID = user?.photoURL.split('/').pop()?.split('.')[0];
        await cloudinary.uploader.destroy('uploads/' + publicID!);
      }

      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileData}`, {
        folder: 'uploads',
        transformation: [
          { width: 300, height: 300, crop: 'fill' }, // Replace 300 with your desired width and height
        ],
      });

      user.photoURL = result.secure_url;
      await user.save();

      res.status(200).send({
        message: 'Profile picture updated successfully',
        imageUrl: result.secure_url,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Error updating User ${userID}'s photoURL`,
        error: err,
      });
    }
  }

  public static async deleteProfilePicture(req: Request, res: Response) {
    const userID: string = req.auth.userId;
    try {
      const user = await User.findOneAndUpdate(
        { _id: userID },
        {
          photoURL: defaultProfilePicture,
        }
      ).exec();
      res.status(200).send({
        message: 'Profile picture removed successfully',
      });
      if (!user) {
        return res.status(404).json({
          message: `User ${userID} not found`,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Error removing User ${userID}'s photoURL`,
        error: err,
      });
    }
  }
}
export default UserController;
