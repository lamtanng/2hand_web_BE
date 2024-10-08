import express from 'express';
import {
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  REFRESH_TOKEN_ROUTE,
  SEND_OTP_ROUTE,
  SIGNUP_ROUTE,
  VERIFY_OTP_ROUTE,
} from '../../constants/routes';
import { authController } from '../../controllers/auth.controller';
import { otpController } from '../../controllers/otp.controller';
import { isAuthorized } from '../../middlewares/auth.middleware';
import { otpMiddleware } from '../../middlewares/otp.middleware';
import { loginValidation } from '../../validations/authValidation/login.validation';
import { signupValidation } from '../../validations/authValidation/signup.validation';

const router = express.Router();

router.route(LOGIN_ROUTE).post(loginValidation, authController.login);
router.route(SIGNUP_ROUTE).post(signupValidation, authController.signup);
router.route(LOGOUT_ROUTE).delete(isAuthorized, authController.logout);
router.route(REFRESH_TOKEN_ROUTE).put(isAuthorized, authController.refreshToken);
router.route(VERIFY_OTP_ROUTE).post(isAuthorized, otpMiddleware.verifyOTP, otpController);
router
  .route(SEND_OTP_ROUTE)
  .post(isAuthorized, otpMiddleware.sendOtpVerificationEmail, otpController);

export const authRouter = router;
