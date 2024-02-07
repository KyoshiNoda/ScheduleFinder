"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hobbySchema = new mongoose_1.default.Schema({
    tag_id: { type: Number, require: true },
    name: { type: String, require: true },
});
const Hobby = mongoose_1.default.model('Hobby', hobbySchema);
exports.default = Hobby;
