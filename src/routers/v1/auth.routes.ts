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
import { userController } from '../../controllers/user.controller';
import { isAuthorized } from '../../middlewares/auth.middleware';
import { otpMiddleware } from '../../middlewares/otp.middleware';
import { userMiddleware } from '../../middlewares/user.middleware';
import { loginValidation } from '../../validations/authValidation/login.validation';
import { signupValidation } from '../../validations/authValidation/signup.validation';
import { userValidation } from '../../validations/user.validation';

const router = express.Router();
const { sendSmsOtp } = userController;
const { verifySmsOTP } = otpMiddleware;
const { isPhoneNumberExists } = userMiddleware;
const { sendSmsOtpValidation, verifySignupValidation } = userValidation;

router.route(LOGIN_ROUTE).post(loginValidation, authController.login);
router.route(SIGNUP_ROUTE).post(signupValidation, isPhoneNumberExists, sendSmsOtp);
router.route(LOGOUT_ROUTE).delete(isAuthorized, authController.logout);
router.route(REFRESH_TOKEN_ROUTE).put(isAuthorized, authController.refreshToken);
router.route(VERIFY_OTP_ROUTE).post(verifySignupValidation, verifySmsOTP, authController.signup);
router.route(SEND_OTP_ROUTE).post(sendSmsOtpValidation, isPhoneNumberExists, sendSmsOtp);

export const authRouter = router;
