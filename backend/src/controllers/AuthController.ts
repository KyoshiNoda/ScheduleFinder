import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { toAuthUser } from '../representations/userRepresentation';
import { signAccessToken } from '../auth/accessToken';
import {
  CompletePasswordResetBody,
  EmailBody,
  LoginBody,
  RegisterBody,
  VerifyPasswordResetBody,
} from '../validation/schemas';
import {
  completePasswordReset,
  requestPasswordReset,
  verifyPasswordResetCode,
} from '../auth/passwordReset';

class AuthController {
  public static async loginUser(req: Request<Record<string, never>, unknown, LoginBody>, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).send({ error: 'Email not found.' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).send({ error: 'Incorrect password.' });
      }

      const accessToken = signAccessToken(user.id);

      res.send({ token: accessToken, user: toAuthUser(user) });
    } catch (err) {
      res.status(500).send({ error: 'Unable to log in.' });
    }
  }

  public static async registerUser(
    req: Request<Record<string, never>, unknown, RegisterBody>,
    res: Response
  ) {
    const { firstName, lastName, email, password, school, birthday } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({ error: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      photoURL:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s',
      email: email,
      password: hashedPassword,
      school: school,
      gender: null,
      major: null,
    });
    try {
      const savedUser = await user.save();
      const accessToken = signAccessToken(savedUser.id);
      res.status(200).send({ token: accessToken, user: toAuthUser(savedUser) });
    } catch (err) {
      return res.status(500).send({ error: 'Unable to register user.' });
    }
  }

  public static async resetPasswordRequest(
    req: Request<Record<string, never>, unknown, EmailBody>,
    res: Response
  ) {
    try {
      await requestPasswordReset(req.body.email);

      return res.status(202).json({
        message: 'If an account exists, a reset code will be sent.',
      });
    } catch {
      return res.status(500).json({ error: 'Unable to process password reset request.' });
    }
  }

  public static async verifyResetPasswordCode(
    req: Request<Record<string, never>, unknown, VerifyPasswordResetBody>,
    res: Response
  ) {
    try {
      const verifiedReset = await verifyPasswordResetCode(req.body.email, req.body.code);

      if (!verifiedReset) {
        return res.status(400).json({
          error: 'Invalid or expired reset code.',
          code: 'INVALID_RESET_CODE',
        });
      }

      return res.status(200).json(verifiedReset);
    } catch {
      return res.status(500).json({ error: 'Unable to verify password reset code.' });
    }
  }

  public static async completePasswordReset(
    req: Request<Record<string, never>, unknown, CompletePasswordResetBody>,
    res: Response
  ) {
    try {
      const passwordChanged = await completePasswordReset(
        req.body.email,
        req.body.resetToken,
        req.body.newPassword
      );

      if (!passwordChanged) {
        return res.status(400).json({
          error: 'Invalid or expired reset proof.',
          code: 'INVALID_RESET_PROOF',
        });
      }

      return res.status(200).json({ message: 'Password changed.' });
    } catch {
      return res.status(500).json({ error: 'Unable to complete password reset.' });
    }
  }
}

export default AuthController;
