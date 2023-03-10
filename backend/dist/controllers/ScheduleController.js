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
    static getScheduleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield scheduleModel_1.default.findById(id);
            res.json(user);
        });
    }
    static createSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = new scheduleModel_1.default({
                user_id: req.body.user_id,
                visibility: req.body.visibility,
                timeSlot: [],
            });
            schedule.save().then(() => console.log('schedule entry added'));
        });
    }
    static insertTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTimeSlot = {
                _id: new mongoose.Types.ObjectId(),
                day: req.body.day,
                category: req.body.category,
                title: req.body.title,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                color: req.body.color,
                location: req.body.location,
                professor: req.body.professor,
            };
            yield scheduleModel_1.default.findOneAndUpdate({ _id: req.params.id }, { $push: { timeSlot: newTimeSlot } }).then(() => console.log('inserted'));
        });
    }
    static updateSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedule = yield scheduleModel_1.default.findOneAndUpdate({ _id: req.params.id }, Object.assign({}, req.body));
                res.json(schedule);
            }
            catch (error) {
                res.status(400).json(`The update attempt to user ${req.params._id} has failed`);
            }
        });
    }
    static updateTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = yield scheduleModel_1.default.findOne({ _id: req.params.id }, (err, found) => {
                if (!err) {
                    return found;
                }
            }).clone();
            const timeSlotIndex = schedule === null || schedule === void 0 ? void 0 : schedule.timeSlot.findIndex((timeSlot) => timeSlot._id == req.body._id);
            schedule.timeSlot[timeSlotIndex] = Object.assign(Object.assign({}, schedule === null || schedule === void 0 ? void 0 : schedule.timeSlot[timeSlotIndex]), req.body);
            yield (schedule === null || schedule === void 0 ? void 0 : schedule.save());
            res.send("it worked!");
        });
    }
    static deleteTimeSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = yield scheduleModel_1.default.findOne({ _id: req.params.id }, (err, found) => {
                if (!err) {
                    return found;
                }
                else {
                    res.status(404).json({ error: "Schedule not Found" });
                }
            }).clone();
            if (schedule && schedule.timeSlot) {
                schedule.timeSlot = schedule.timeSlot.filter((deletedItem) => deletedItem._id != req.body._id);
            }
            yield (schedule === null || schedule === void 0 ? void 0 : schedule.save());
            res.send("deleted timeSlot");
        });
    }
    static getScheduleByToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_ID = req.user.data._id;
            const user = yield scheduleModel_1.default.find({ user_id: user_ID }, (err, found) => {
                if (!err) {
                    return found;
                }
                else {
                    res.status(400).json(err);
                }
            })
                .clone()
                .catch((err) => console.log(err));
            res.json(user);
        });
    }
    static deleteScheduleByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield scheduleModel_1.default.deleteOne({ _id: id }, (err, deleted) => {
                if (!err) {
                    res.json(`schedule ${id} was deleted!`);
                }
                else {
                    res.status(400).json(err);
                }
            }).clone().catch(err => console.log(err));
        });
    }
}
exports.default = ScheduleController;
