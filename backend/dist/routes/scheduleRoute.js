"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ScheduleController_1 = __importDefault(require("../controllers/ScheduleController"));
const router = express_1.default.Router();
router.get('/getSchedules', ScheduleController_1.default.getAllSchedules);
exports.default = router;
