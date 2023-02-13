"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    static getUsers(req, res) {
        const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];
        res.status(200).json(users);
    }
}
exports.default = UserController;
