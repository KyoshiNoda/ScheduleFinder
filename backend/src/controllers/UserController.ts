import { Request, Response } from "express";

class UserController {
  public static getUsers(req: Request, res: Response): void {
    const users = [{ id: 1, name: "Kyoshi" }, { id: 2, name: "Jane" }];

    res.status(200).send(users);
  }
}

export default UserController;
