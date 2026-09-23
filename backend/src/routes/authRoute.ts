import express from 'express';
import AuthController from '../controllers/AuthController';
import {
  completePasswordResetBodySchema,
  emailBodySchema,
  loginBodySchema,
  registerBodySchema,
  verifyPasswordResetBodySchema,
} from '../validation/schemas';
import { validateRequest } from '../validation/validateRequest';
const router = express.Router();

router.post('/register', validateRequest({ body: registerBodySchema }), AuthController.registerUser);
router.post('/login', validateRequest({ body: loginBodySchema }), AuthController.loginUser);
router.post(
  '/password-reset/request',
  validateRequest({ body: emailBodySchema }),
  AuthController.resetPasswordRequest
);
router.post(
  '/password-reset/verify',
  validateRequest({ body: verifyPasswordResetBodySchema }),
  AuthController.verifyResetPasswordCode
);
router.post(
  '/password-reset/complete',
  validateRequest({ body: completePasswordResetBodySchema }),
  AuthController.completePasswordReset
);
export default router;
