"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = express_1.default.Router();
router.get('/getUsers', UserController_1.default.getAllUsers);
router.get('/:id', UserController_1.default.getUserById);
router.post('/createUser', UserController_1.default.createUser);
router.delete('/:id', UserController_1.default.deleteUser);
router.patch('/updateFirstName/:id', UserController_1.default.updateFirstName);
router.patch('/updateLastName/:id', UserController_1.default.updateLastName);
router.patch('/updateEmail/:id', UserController_1.default.updateEmail);
router.patch('/updatePassword/:id', UserController_1.default.updatePassword);
router.patch('/updateGender/:id', UserController_1.default.updateGender);
router.patch('/updateSchool/:id', UserController_1.default.updateSchool);
exports.default = router;
