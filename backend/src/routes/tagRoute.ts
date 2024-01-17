import express from 'express';
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.get('/userTags', AuthController.authenticateToken);

router.patch('/userTags', AuthController.authenticateToken);

router.delete('/userTags/:id', AuthController.authenticateToken);

router.get('/');

router.get('/:id');

router.post('/');
