"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const timeSlotSchema = new mongoose_1.default.Schema({
    _id: { type: Number, required: true },
    day: { type: String, required: true },
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    color: { type: String, required: true },
    location: String,
    professor: String,
});
const scheduleSchema = new mongoose_1.default.Schema({
    user_id: { type: String, required: true },
    visibility: { type: String, required: true },
    timeSlot: { type: Array, default: [timeSlotSchema] },
});
const Schedule = mongoose_1.default.model('Schedule', scheduleSchema);
exports.default = Schedule;
