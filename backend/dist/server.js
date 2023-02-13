"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express_1.default.Router();
        this.app.listen(3001, () => console.log('listening on port 3001'));
        this.app.use("/", userRoute_1.default);
    }
}
exports.default = new App().app;
