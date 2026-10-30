import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { destroyProfileImage, uploadProfileImage } from '../integrations/outbound';
import {
  toPrivateUser,
  toPublicUser,
} from '../representations/userRepresentation';
import {
  ChangePasswordWithTokenBody,
  IdParams,
  UpdateUserBody,
} from '../validation/schemas';

const defaultProfilePicture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s';

const startsWithBytes = (buffer: Buffer, signature: readonly number[]): boolean =>
  buffer.length >= signature.length &&
  signature.every((byte, index) => buffer[index] === byte);

const imageMime = (buffer: Buffer): string | null => {
  if (startsWithBytes(buffer, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWithBytes(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
};

const cleanupImage = async (publicId: string): Promise<void> => {
  try { await destroyProfileImage(publicId); }
  catch { console.error('Unable to remove a managed profile image.'); }
};

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
  public static async changeProfilePicture(req: Request, res: Response) {
    const userID: string = req.auth.userId;
    const uploadedFile = req.file;
    if (!uploadedFile) return res.status(400).json({ error: 'Profile image is required.' });

    const detectedMime = imageMime(uploadedFile.buffer);
    if (!detectedMime || detectedMime !== uploadedFile.mimetype) {
      return res.status(415).json({ error: 'Profile image must be a JPEG, PNG, or WebP file.' });
    }

    let user;
    try {
      user = await User.findById(userID).select('+profileImagePublicId').exec();
    } catch {
      return res.status(500).json({ error: 'Unable to update profile image.' });
    }
    if (!user) return res.status(404).json({ error: 'User not found.' });

    let replacement: { secureUrl: string; publicId: string };
    try {
      replacement = await uploadProfileImage(`data:${detectedMime};base64,${uploadedFile.buffer.toString('base64')}`);
    } catch {
      return res.status(502).json({ error: 'Unable to upload profile image.' });
    }

    let updated;
    try {
      updated = await User.findOneAndUpdate(
        { _id: userID, photoURL: user.photoURL },
        { $set: { photoURL: replacement.secureUrl, profileImagePublicId: replacement.publicId } },
        { new: true }
      ).exec();
    } catch {
      await cleanupImage(replacement.publicId);
      return res.status(500).json({ error: 'Unable to update profile image.' });
    }
    if (!updated) {
      await cleanupImage(replacement.publicId);
      return res.status(409).json({ error: 'Profile image changed; retry the upload.' });
    }
    if (user.profileImagePublicId) await cleanupImage(user.profileImagePublicId);
    return res.status(200).json({ message: 'Profile picture updated successfully', imageUrl: replacement.secureUrl });
  }

  public static async deleteProfilePicture(req: Request, res: Response) {
    const userID: string = req.auth.userId;
    try {
      const user = await User.findOneAndUpdate(
        { _id: userID },
        { $set: { photoURL: defaultProfilePicture }, $unset: { profileImagePublicId: 1 } },
        { new: false }
      ).select('+profileImagePublicId').exec();
      if (!user) return res.status(404).json({ error: 'User not found.' });
      if (user.profileImagePublicId) await cleanupImage(user.profileImagePublicId);
      return res.status(200).json({ message: 'Profile picture removed successfully' });
    } catch {
      return res.status(500).json({ error: 'Unable to remove profile image.' });
    }
  }
}
export default UserController;
