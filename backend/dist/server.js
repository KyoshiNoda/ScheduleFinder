"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3001, () => {
    console.log('listening on port 3001');
});
app.get('/', (req, res) => {
    res.send(`running on port ${3001}`);
});
app.get('/ts', (req, res) => {
    res.send("this is typescript change! part 10");
});
