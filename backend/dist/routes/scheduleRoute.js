"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ScheduleController_1 = __importDefault(require("../controllers/ScheduleController"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = express_1.default.Router();
router.get('/', ScheduleController_1.default.getAllSchedules);
router.get('/userSchedule', AuthController_1.default.authenticateToken, ScheduleController_1.default.getScheduleByToken);
router.get('/:id', ScheduleController_1.default.getScheduleById);
router.post('/', ScheduleController_1.default.createSchedule);
router.post('/:id', ScheduleController_1.default.insertTimeSlot);
router.patch('/:id', ScheduleController_1.default.updateSchedule);
router.patch('/:id/timeSlot', ScheduleController_1.default.updateTimeSlot);
router.delete('/:id', ScheduleController_1.default.deleteScheduleByID);
router.delete('/:id/timeSlot', ScheduleController_1.default.deleteTimeSlot);
exports.default = router;
