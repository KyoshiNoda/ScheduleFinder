"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const scheduleModel_1 = __importDefault(require("../models/scheduleModel"));
const schemas_1 = require("../validation/schemas");
const validateRequest_1 = require("../validation/validateRequest");
class ScheduleController {
    static timeSlotsOverlap(candidate, timeSlots, excludedTimeSlotID) {
        const candidateStart = (0, schemas_1.parseTimeToMinutes)(candidate.startTime);
        const candidateEnd = (0, schemas_1.parseTimeToMinutes)(candidate.endTime);
        return timeSlots.some((timeSlot) => {
            if (excludedTimeSlotID && timeSlot._id.toString() === excludedTimeSlotID) {
                return false;
            }
            const sharesDay = schemas_1.DAYS_OF_WEEK.some((day) => { var _a; return candidate.days[day] && ((_a = timeSlot.days) === null || _a === void 0 ? void 0 : _a[day]); });
            if (!sharesDay) {
                return false;
            }
            const existingStart = (0, schemas_1.parseTimeToMinutes)(timeSlot.startTime);
            const existingEnd = (0, schemas_1.parseTimeToMinutes)(timeSlot.endTime);
            if ([candidateStart, candidateEnd, existingStart, existingEnd].some(Number.isNaN)) {
                return false;
            }
            return candidateStart < existingEnd && existingStart < candidateEnd;
        });
    }
    static getOwnedSchedule(scheduleID, userID, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = yield scheduleModel_1.default.findById(scheduleID);
            if (!schedule) {
                res.status(404).json({ error: 'Schedule not found' });
                return null;
            }
            if (schedule.user_id !== userID) {
                res.status(403).json({ error: 'Forbidden' });
                return null;
            }
            return schedule;
        });
    }
    static getMySchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            try {
                const schedule = yield scheduleModel_1.default.findOne({ user_id: userID }).exec();
                if (!schedule) {
                    return res.status(404).json({ error: 'Schedule not found' });
                }
                return res.status(200).send(schedule);
            }
            catch (_a) {
                return res.status(500).json({ error: 'Unable to retrieve schedule' });
            }
        });
    }
    static updateSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const scheduleID = req.params.id;
            try {
                const schedule = yield ScheduleController.getOwnedSchedule(scheduleID, userID, res);
                if (!schedule) {
                    return;
                }
                schedule.visibility = req.body.visibility;
                yield schedule.save();
                return res.status(200).send(schedule);
            }
            catch (_a) {
                return res.status(400).json({ error: 'Unable to update schedule' });
            }
        });
    }
    static clearScheduleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const scheduleID = req.params.id;
            try {
                const schedule = yield ScheduleController.getOwnedSchedule(scheduleID, userID, res);
                if (!schedule) {
                    return;
                }
                schedule.timeSlots = [];
                yield schedule.save();
                return res.status(200).send(schedule);
            }
            catch (_a) {
                return res.status(400).json({ error: 'Unable to clear schedule' });
            }
        });
    }
    static insertTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const scheduleID = req.params.id;
            try {
                const schedule = yield ScheduleController.getOwnedSchedule(scheduleID, userID, res);
                if (!schedule) {
                    return;
                }
                const newTimeSlot = {
                    _id: new mongoose.Types.ObjectId(),
                    days: req.body.days,
                    title: req.body.title,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    color: req.body.color,
                    location: req.body.location,
                    professor: req.body.professor,
                };
                if (ScheduleController.timeSlotsOverlap(newTimeSlot, schedule.timeSlots)) {
                    return (0, validateRequest_1.sendValidationError)(res, [
                        {
                            path: 'body.startTime',
                            message: 'Time slot overlaps an existing slot on a selected day.',
                        },
                    ]);
                }
                schedule.timeSlots.push(newTimeSlot);
                yield schedule.save();
                return res.status(200).send(newTimeSlot);
            }
            catch (_a) {
                return res.status(400).json({ error: 'Unable to add time slot' });
            }
        });
    }
    static updateTimeSlot(req, res) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const scheduleID = req.params.id;
            try {
                const schedule = yield ScheduleController.getOwnedSchedule(scheduleID, userID, res);
                if (!schedule) {
                    return;
                }
                const timeSlotIndex = schedule.timeSlots.findIndex((timeSlot) => timeSlot._id.toString() === req.body._id);
                if (timeSlotIndex < 0) {
                    return res.status(404).json({ error: 'Time slot not found' });
                }
                const existingTimeSlot = schedule.timeSlots[timeSlotIndex];
                const updatedTimeSlot = {
                    _id: existingTimeSlot._id,
                    days: (_a = req.body.days) !== null && _a !== void 0 ? _a : existingTimeSlot.days,
                    title: (_b = req.body.title) !== null && _b !== void 0 ? _b : existingTimeSlot.title,
                    startTime: (_c = req.body.startTime) !== null && _c !== void 0 ? _c : existingTimeSlot.startTime,
                    endTime: (_d = req.body.endTime) !== null && _d !== void 0 ? _d : existingTimeSlot.endTime,
                    color: (_e = req.body.color) !== null && _e !== void 0 ? _e : existingTimeSlot.color,
                    location: req.body.location !== undefined ? req.body.location : existingTimeSlot.location,
                    professor: req.body.professor !== undefined ? req.body.professor : existingTimeSlot.professor,
                };
                if ((0, schemas_1.parseTimeToMinutes)(updatedTimeSlot.startTime) >=
                    (0, schemas_1.parseTimeToMinutes)(updatedTimeSlot.endTime)) {
                    return (0, validateRequest_1.sendValidationError)(res, [
                        { path: 'body.startTime', message: 'Start time must be before end time.' },
                    ]);
                }
                if (ScheduleController.timeSlotsOverlap(updatedTimeSlot, schedule.timeSlots, existingTimeSlot._id.toString())) {
                    return (0, validateRequest_1.sendValidationError)(res, [
                        {
                            path: 'body.startTime',
                            message: 'Time slot overlaps an existing slot on a selected day.',
                        },
                    ]);
                }
                schedule.timeSlots[timeSlotIndex] = updatedTimeSlot;
                yield schedule.save();
                return res.status(200).send(schedule.timeSlots[timeSlotIndex]);
            }
            catch (_f) {
                return res.status(400).json({ error: 'Unable to update time slot' });
            }
        });
    }
    static deleteTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.auth.userId;
            const scheduleID = req.params.id;
            try {
                const schedule = yield ScheduleController.getOwnedSchedule(scheduleID, userID, res);
                if (!schedule) {
                    return;
                }
                const timeSlotId = req.body._id;
                const deletedTimeSlot = schedule.timeSlots.find((timeSlot) => timeSlot._id.toString() === timeSlotId);
                if (!deletedTimeSlot) {
                    return res.status(404).json({ error: 'Time slot not found' });
                }
                schedule.timeSlots = schedule.timeSlots.filter((timeSlot) => timeSlot._id.toString() !== timeSlotId);
                yield schedule.save();
                return res.status(200).send(deletedTimeSlot);
            }
            catch (_a) {
                return res.status(500).json({ error: 'Unable to delete time slot' });
            }
        });
    }
    static getScheduleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedule = yield ScheduleController.getOwnedSchedule(req.params.id, req.auth.userId, res);
                if (!schedule) {
                    return;
                }
                return res.status(200).send(schedule);
            }
            catch (_a) {
                return res.status(400).json({ error: 'Unable to retrieve schedule' });
            }
        });
    }
    static getScheduleByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestingUserID = req.auth.userId;
            try {
                const schedule = yield scheduleModel_1.default.findOne({ user_id: req.params.id });
                if (!schedule) {
                    return res.status(404).json({ error: 'Schedule not found' });
                }
                if (schedule.user_id !== requestingUserID && schedule.visibility !== 'public') {
                    return res.status(403).json({ error: 'Forbidden' });
                }
                return res.status(200).send(schedule);
            }
            catch (_a) {
                return res.status(400).json({ error: 'Unable to retrieve schedule' });
            }
        });
    }
    static createSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedule = yield scheduleModel_1.default.create({
                    user_id: req.auth.userId,
                    visibility: 'public',
                    timeSlots: [],
                });
                return res.status(200).send(schedule);
            }
            catch (_a) {
                return res.status(400).json({ error: 'Unable to create schedule' });
            }
        });
    }
}
exports.default = ScheduleController;
