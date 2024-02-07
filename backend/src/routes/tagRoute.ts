import express from 'express';
import TagController from '../controllers/TagController';
import AuthController from '../controllers/AuthController';

const router = express.Router();

// GET all the tags of a user
router.get('/userTags', AuthController.authenticateToken, TagController.getUserTags);

// This route is used when a user wants to add an already existing tag to ther collection of tags.
router.patch('/userTags', AuthController.authenticateToken, TagController.updateUserTags);

// This route is used when a user deletes a single tag from its list of tags.
router.delete('/userTags/:id', AuthController.authenticateToken, TagController.deleteUserTag);

// This route is used when a user deletes all tags from its list of tags.
router.delete('/userTags', AuthController.authenticateToken, TagController.clearUserTags);

// GET all existing tags
router.get('/', TagController.getAllTags);

// This route is used when a user creates a new tag.
router.post('/', TagController.createTag);

export default router;
