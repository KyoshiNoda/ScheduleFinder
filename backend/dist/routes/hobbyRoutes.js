"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HobbyController_1 = __importDefault(require("../controllers/HobbyController"));
const authenticateToken_1 = require("../auth/authenticateToken");
const router = express_1.default.Router();
// GET all the tags of a user
router.get('/userHobbies', authenticateToken_1.authenticateToken, HobbyController_1.default.getUserHobbies);
// This route is used when a user wants to add an already existing tag to ther collection of tags.
router.patch('/userHobbies', authenticateToken_1.authenticateToken, HobbyController_1.default.updateUserHobbies);
// This route is used when a user deletes a single tag from its list of tags.
router.delete('/userHobbies/:name', authenticateToken_1.authenticateToken, HobbyController_1.default.deleteUserHobby);
// This route is used when a user deletes all tags from its list of tags.
router.delete('/userHobbies', authenticateToken_1.authenticateToken, HobbyController_1.default.clearUserHobbies);
// GET all existing tags
router.get('/', HobbyController_1.default.getAllTags);
exports.default = router;
