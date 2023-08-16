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
class ScheduleController {
    // GET USER's Schedule by Token
    static getMySchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            try {
                const userSchedule = yield scheduleModel_1.default.find({ user_id: userID }).exec();
                if (!userSchedule) {
                    return res.status(404).json({
                        message: `Schedule for user ${userID} not found`,
                    });
                }
                res.json(userSchedule);
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    message: `Error while getting schedule for user ${userID}`,
                    error: err,
                });
            }
        });
    }
    // PATCH an existing schedule by Token
    static updateSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            const scheduleID = req.params.id;
            try {
                const schedule = yield scheduleModel_1.default.findOneAndUpdate({ _id: scheduleID, user_id: userID }, Object.assign({}, req.body), { new: true });
                if (!schedule) {
                    return res.status(404).json({ error: 'Schedule not found' });
                }
                res.status(200).send(schedule);
            }
            catch (error) {
                res.status(400).send({
                    error: `The update attempt to schedule ${scheduleID} has failed`,
                });
            }
        });
    }
    // DELETE all time slots in a schedule using JWT
    static deleteScheduleByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            const scheduleID = req.params.id;
            try {
                const schedule = yield scheduleModel_1.default.findOneAndUpdate({
                    _id: scheduleID,
                    user_id: userID,
                }, {
                    $set: { timeSlot: [] },
                }, { new: true });
                if (!schedule) {
                    return res.status(404).json(`No schedule found with ID ${scheduleID} for user ${userID}`);
                }
                res.status(200).send(schedule);
            }
            catch (error) {
                res.status(400).json(`Failed to update schedule with ID ${scheduleID} for user ${userID}`);
            }
        });
    }
    // POST new time slot into existing schedule
    static insertTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const userID: string = req.user.data._id;
            const scheduleID = req.params.id;
            if (!(req.body.title &&
                req.body.startTime &&
                req.body.endTime &&
                req.body.color &&
                req.body.days)) {
                return res.status(400).json({ message: 'Missing required properties' });
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
            try {
                const schedule = yield scheduleModel_1.default.findOneAndUpdate({ _id: scheduleID }, { $push: { timeSlot: newTimeSlot } }, { new: true });
                if (!schedule) {
                    return res.status(404).json({ message: 'Schedule not found' });
                }
                res.status(200).send(newTimeSlot);
            }
            catch (error) {
                res.status(400).json(`${error}`);
            }
        });
    }
    // PATCH an existing time slot
    static updateTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            const scheduleID = req.params.id;
            try {
                const schedule = yield scheduleModel_1.default.findOne({ _id: scheduleID, user_id: userID }, (err, found) => {
                    if (!err) {
                        return found;
                    }
                }).clone();
                if (!schedule) {
                    return res
                        .status(404)
                        .json(`Schedule not found for user with ID ${userID}`);
                }
                const timeSlotIndex = schedule === null || schedule === void 0 ? void 0 : schedule.timeSlot.findIndex((timeSlot) => timeSlot._id == req.body._id);
                if (timeSlotIndex < 0) {
                    return res
                        .status(404)
                        .json(`Time slot with ID ${req.body._id} not found in schedule`);
                }
                schedule.timeSlot[timeSlotIndex] = Object.assign(Object.assign({}, schedule === null || schedule === void 0 ? void 0 : schedule.timeSlot[timeSlotIndex]), req.body);
                yield (schedule === null || schedule === void 0 ? void 0 : schedule.save());
                res.status(200).send(schedule.timeSlot[timeSlotIndex]);
            }
            catch (error) {
                res.status(400).json(`${error}`);
            }
        });
    }
    // DELETE  a time slot
    static deleteTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.user.data._id;
            const scheduleID = req.params.id;
            try {
                const schedule = yield scheduleModel_1.default.findOne({
                    _id: scheduleID,
                    user_id: userID,
                }).clone();
                if (!schedule) {
                    res.status(404).json({ error: 'Schedule not found' });
                    return;
                }
                const timeSlotId = req.body._id;
                const deletedTimeSlot = schedule.timeSlot.find((timeSlot) => timeSlot._id.toString() === timeSlotId);
                if (!deletedTimeSlot) {
                    res.status(404).json({ error: 'Time slot not found' });
                    return;
                }
                schedule.timeSlot = schedule.timeSlot.filter((timeSlot) => timeSlot._id.toString() !== timeSlotId);
                yield schedule.save();
                res.status(200).send(deletedTimeSlot);
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // GET all schedules
    static getAllSchedules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield scheduleModel_1.default.find({}, (err, result) => {
                if (!err) {
                    res.send(result);
                }
                else {
                    res.status(404).json(err);
                }
            })
                .clone()
                .catch((err) => console.log(err));
        });
    }
    // GET single schedule by schedule id
    static getScheduleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const schedule = yield scheduleModel_1.default.findById(id);
            res.json(schedule);
        });
    }
    // GET single schedule by user id
    static getScheduleByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // This is the user's id
            const id = req.params.id;
            try {
                const schedule = yield scheduleModel_1.default.find({ user_id: id });
                res.send(schedule);
            }
            catch (error) {
                res.send({ message: 'Error retrieving schedule' });
            }
        });
    }
    // POST new schedule
    static createSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = new scheduleModel_1.default({
                user_id: req.body.user_id,
                visibility: 'public',
                timeSlot: [],
            });
            schedule
                .save()
                .then((savedSchedule) => res.status(200).send(savedSchedule))
                .catch((err) => res.send(err));
        });
    }
}
exports.default = ScheduleController;
