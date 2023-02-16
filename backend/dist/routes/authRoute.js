"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = express_1.default.Router();
const calander = [
    {
        email: "kyoshisew@gmail.com",
        timeSlot: [
            { time: "blah" },
            { time: "hi" }
        ]
    },
    {
        email: "carlosduque@gmail.com",
        timeSlot: [
            { time: "boo" },
            { time: "yooo" }
        ]
    }
];
router.post('/login', AuthController_1.default.loginUser);
router.get('/calander', AuthController_1.default.authToken, (req, res) => {
    res.send(calander.filter((user) => user.email === req.user.data.email));
});
exports.default = router;
