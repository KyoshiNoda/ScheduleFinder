import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {
  public static async loginUser(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res
        .status(400)
        .send({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Email not found.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({ error: 'Incorrect password.' });
    }

    const accessToken = jwt.sign(
      { data: user },
      `${process.env.ACCESS_TOKEN_SECRET}`
    );
    res.send({ token: accessToken, user: user });
  }

  public static async registerUser(req: Request, res: Response) {
    const { firstName, lastName, email, password, school, birthday } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !school ||
      !birthday
    ) {
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
      photoURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGl68Y0oCfYlx18OswvBI5QNYjr7bHdCCUvAf8lHeig&s",
      email: email,
      password: hashedPassword,
      school: school,
      gender: null,
      major: null,
    });
    try {
      const savedUser = await user.save();
      const accessToken = jwt.sign(
        { data: savedUser },
        `${process.env.ACCESS_TOKEN_SECRET}`
      );
      res.status(200).send({ token: accessToken, user: savedUser });
    } catch (err) {
      return res.status(500).send({ error: 'Unable to register user.' });
    }
  }

  public static async authenticateToken(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers['authorization']!;
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
      return res.sendStatus(401);
    }
    jwt.verify(
      token,
      `${process.env.ACCESS_TOKEN_SECRET}`,
      (err: any, user: any) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      }
    );
  }
}

export default AuthController;
