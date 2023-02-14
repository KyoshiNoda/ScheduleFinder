import express from 'express';
import UserController from '../controllers/UserController';
const router = express.Router();
router.get('/getUsers', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/createUser', UserController.createUser);
router.delete('/:id', UserController.deleteUser);

router.patch('/updateFirstName/:id', UserController.updateFirstName);
router.patch('/updateLastName/:id', UserController.updateLastName);
router.patch('/updateEmail/:id', UserController.updateEmail);
router.patch('/updatePassword/:id', UserController.updatePassword);
router.patch('/updateGender/:id', UserController.updateGender);
router.patch('/updateSchool/:id', UserController.updateSchool);
router.patch('/updateAge/:id', UserController.updateAge);
export default router;

