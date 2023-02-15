import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/userModal";
import User from "../models/userModal";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
class AuthController {
  public static async loginUser(req : Request, res : Response){
    await User.findOne({email : req.body.email}, async (err : any, found : IUser | undefined) =>{
      if(!(found === undefined)){
        if(await bcrypt.compare(req.body.password,found?.password)){
          return found;
        }
        else{
          res.send("not allowed");
        }
      }
      else{
        res.status(400).send("No user Found");
      }
    }).clone().exec().then((docs =>{
      const accessToken = jwt.sign({data : docs},`${process.env.ACCESS_TOKEN_SECRET}`);
      res.send({token : accessToken});
    }));
  }
}

export default AuthController;
