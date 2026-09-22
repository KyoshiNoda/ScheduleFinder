import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import { toAuthUser } from '../representations/userRepresentation';
import { signAccessToken } from '../auth/accessToken';
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);
class AuthController {
  private static randomCode: string;

  public static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required.' });
    }
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

  public static async registerUser(req: Request, res: Response) {
    const { firstName, lastName, email, password, school, birthday } = req.body;

    if (!firstName || !lastName || !email || !password || !school || !birthday) {
      return res.status(400).send({ error: 'All fields are required.' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({ error: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
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

  public static async emailCheck(req: Request, res: Response) {
    let email: string = req.body.email;
    try {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return res.status(404).json({ message: 'Invalid Email' });
      }
      return res.status(200).json({ message: 'User found!' });
    } catch (error) {
      console.error('Error while checking email:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public static async resetPasswordRequest(req: Request, res: Response) {
    let email: string = req.body.email;
    let randomCode = (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString();
    AuthController.randomCode = randomCode;
    let message: string = `Here is your five digit code: ${AuthController.randomCode}`;

    let codeHTML = '';
    for (let digit of AuthController.randomCode) {
      codeHTML += `<div style="display: inline-block; margin: 5px; padding: 10px; background-color: #fff; color: #3b82f6; border-radius: 5px;">${digit}</div>`;
    }

    const msg: sgMail.MailDataRequired = {
      to: email,
      from: 'schedulefinder@gmail.com',
      subject: 'ScheduleFinder - Password Reset',
      text: message,
      html: `<strong>${message}</strong>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        res.status(200).send({ message: 'email sent!', email: email });
      })
      .catch((error) => {
        res.status(400).send({ error: 'error found try again!' });
      });
  }

  public static async verifyResetPasswordCode(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const code = req.body.code;

      if (code === AuthController.randomCode) {
        return res.status(200).send({ message: 'User can reset password' });
      }

      AuthController.randomCode = (
        Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
      ).toString();

      let codeHTML = '';
      for (let digit of AuthController.randomCode) {
        codeHTML += `<div style="display: inline-block; margin: 5px; padding: 10px; background-color: #fff; color: #3b82f6; border-radius: 5px;">${digit}</div>`;
      }

      let message: string = `Here is your five digit code: ${AuthController.randomCode}`;
      const msg: sgMail.MailDataRequired = {
        to: email,
        from: 'schedulefinder@gmail.com',
        subject: 'ScheduleFinder - Password Reset',
        text: message,
        html: `
          <div style="font-family: Arial, sans-serif; color: #fff; background-color: #3b82f6; padding: 20px;">
            <h2 style="color: #fff;">ScheduleFinder - Password Reset</h2>
            <p><strong>Here is your five digit code:</strong></p>
            <div style="font-size: 2em;">${codeHTML}</div>
            <p>Please enter this code and reset your password.</p>
          </div>
        `,
      };

      await sgMail.send(msg);

      return res.status(400).send({
        message: 'Incorrect code! Sending another email with a new code',
      });
    } catch (error) {
      return res.status(500).send({ message: 'Error found. Please try again!' });
    }
  }
}

export default AuthController;
