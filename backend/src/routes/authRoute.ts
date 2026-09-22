import express from 'express';
import AuthController from '../controllers/AuthController';
import {
  emailBodySchema,
  loginBodySchema,
  registerBodySchema,
  resetCodeBodySchema,
} from '../validation/schemas';
import { validateRequest } from '../validation/validateRequest';
const router = express.Router();

router.post('/register', validateRequest({ body: registerBodySchema }), AuthController.registerUser);
router.post('/login', validateRequest({ body: loginBodySchema }), AuthController.loginUser);
router.post('/emailCheck', validateRequest({ body: emailBodySchema }), AuthController.emailCheck);
router.post(
  '/resetPasswordRequest',
  validateRequest({ body: emailBodySchema }),
  AuthController.resetPasswordRequest
);
router.post(
  '/verifyResetPasswordCode',
  validateRequest({ body: resetCodeBodySchema }),
  AuthController.verifyResetPasswordCode
);
export default router;
