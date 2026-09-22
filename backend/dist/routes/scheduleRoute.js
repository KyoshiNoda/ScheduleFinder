"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ScheduleController_1 = __importDefault(require("../controllers/ScheduleController"));
const authenticateToken_1 = require("../auth/authenticateToken");
const router = express_1.default.Router();
router.get('/mySchedule', authenticateToken_1.authenticateToken, ScheduleController_1.default.getMySchedule);
router.post('/:id', authenticateToken_1.authenticateToken, ScheduleController_1.default.insertTimeSlot);
router.patch('/:id', authenticateToken_1.authenticateToken, ScheduleController_1.default.updateSchedule);
router.patch('/:id/timeSlot', authenticateToken_1.authenticateToken, ScheduleController_1.default.updateTimeSlot);
router.delete('/:id', authenticateToken_1.authenticateToken, ScheduleController_1.default.clearScheduleById);
router.delete('/:id/timeSlot', authenticateToken_1.authenticateToken, ScheduleController_1.default.deleteTimeSlot);
router.get('/:id/user', authenticateToken_1.authenticateToken, ScheduleController_1.default.getScheduleByUserId);
router.get('/:id', authenticateToken_1.authenticateToken, ScheduleController_1.default.getScheduleById);
router.post('/', authenticateToken_1.authenticateToken, ScheduleController_1.default.createSchedule);
exports.default = router;
