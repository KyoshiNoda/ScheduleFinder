"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TagController_1 = __importDefault(require("../controllers/TagController"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = express_1.default.Router();
// GET all the tags of a user
router.get('/userHobbies', AuthController_1.default.authenticateToken, TagController_1.default.getUserHobbies);
// This route is used when a user wants to add an already existing tag to ther collection of tags.
router.patch('/userHobbies', AuthController_1.default.authenticateToken, TagController_1.default.updateUserHobbies);
// This route is used when a user deletes a single tag from its list of tags.
router.delete('/userHobbies/:id', AuthController_1.default.authenticateToken, TagController_1.default.deleteUserHobby);
// This route is used when a user deletes all tags from its list of tags.
router.delete('/userHobbies', AuthController_1.default.authenticateToken, TagController_1.default.clearUserHobbies);
// GET all existing tags
router.get('/', TagController_1.default.getAllTags);
// This route is used when a user creates a new tag.
router.post('/', TagController_1.default.createHobby);
exports.default = router;
