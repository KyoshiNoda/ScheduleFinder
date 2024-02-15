import express from 'express';
import HobbyController from '../controllers/HobbyController';
import AuthController from '../controllers/AuthController';

const router = express.Router();

// GET all the tags of a user
router.get('/userHobbies', AuthController.authenticateToken, HobbyController.getUserHobbies);

// This route is used when a user wants to add an already existing tag to ther collection of tags.
router.patch('/userHobbies', AuthController.authenticateToken, HobbyController.updateUserHobbies);

// This route is used when a user deletes a single tag from its list of tags.
router.delete(
  '/userHobbies/:id',
  AuthController.authenticateToken,
  HobbyController.deleteUserHobby
);

// This route is used when a user deletes all tags from its list of tags.
router.delete('/userHobbies', AuthController.authenticateToken, HobbyController.clearUserHobbies);

// GET all existing tags
router.get('/', HobbyController.getAllTags);

export default router;
