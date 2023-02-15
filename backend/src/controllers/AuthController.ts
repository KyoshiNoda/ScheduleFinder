import { NextFunction, Request, Response } from "express";
import User from "../models/userModal";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
class AuthController {

  public static async loginUser(req : Request, res : Response){
    await User.findOne({email : req.body.email}, async (err : any,found : any) =>{
      if(!(found === undefined)){
        if(await bcrypt.compare(req.body.password,found.password)){
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

  public static async authUser(req : Request, res : Response, next : NextFunction){
    const authHeader = req.headers['authorization']!
    const token = authHeader && authHeader.split(" ")[1]
    if (token === null){
      return res.sendStatus(401)
    }
    jwt.verify(token,`${process.env.ACCESS_TOKEN_SECRET}`,(err,user) =>{
      if(err){
        return res.sendStatus(403);
      }
      req.user = user;
      next()
    });
  }

}

export default AuthController;
