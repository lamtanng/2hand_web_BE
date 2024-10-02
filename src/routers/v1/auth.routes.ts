import express from 'express';
import {
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  REFRESH_TOKEN_ROUTE,
  SIGNUP_ROUTE,
} from '../../constants/routes';
import { authController } from '../../controllers/auth.controller';
import { isAuthorized } from '../../middlewares/auth.middleware';
import { loginValidation } from '../../validations/authValidation/login.validation';
import { signupValidation } from '../../validations/authValidation/signup.validation';

const router = express.Router();

router.route(LOGIN_ROUTE).post(loginValidation, authController.login);
router.route(SIGNUP_ROUTE).post(signupValidation, authController.signup);
router.route(LOGOUT_ROUTE).delete(isAuthorized, authController.logout);
router.route(REFRESH_TOKEN_ROUTE).put(authController.refreshToken);

export const authRouter = router;
