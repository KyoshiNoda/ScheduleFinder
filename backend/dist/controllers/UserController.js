"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    static getUsers(req, res) {
        const users = [{ id: 1, name: "Kyoshi" }, { id: 2, name: "Jane" }];
        res.status(200).send(users);
    }
}
exports.default = UserController;
