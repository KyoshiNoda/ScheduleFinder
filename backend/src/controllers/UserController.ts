import { Request, Response } from "express";

class UserController {
  public static getUsers(req: Request, res: Response): void {
    const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];

    res.status(200).json(users);
  }
}

export default UserController;
