import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import {
  SEND_OTP_ROUTE,
  USER_ADDRESS_ROUTE,
  USER_BY_ID_ROUTE,
  USER_RESET_PASSWORD_ROUTE,
  VERIFY_OTP_ROUTE,
} from '../../../constants/routes';
import { userController } from '../../../controllers/user.controller';
import {
  checkAdminPermission,
  checkCustomerPermission,
} from '../../../middlewares/auth.middleware';
import { otpMiddleware } from '../../../middlewares/otp.middleware';
import { userMiddleware } from '../../../middlewares/user.middleware';
import { userValidation } from '../../../validations/user.validation';
import { userAddressRoutes } from './address.routes';
const router = express.Router();

const {
  findAll,
  addUser,
  updateUserInfo,
  findOneById,
  updateAddress,
  sendSmsOtp,
  createUserPhone,
  findOneBySlug,
  resetPassword,
} = userController;
const { Read, Create, Update, Delete } = ActionPermission.User;
const { verifySmsOTP } = otpMiddleware;
const {
  userModelValidation,
  sendSmsOtpValidation,
  verifySmsOtpValidation,
  updateUserValidation,
  resetPasswordValidation,
} = userValidation;
const { isPhoneNumberExists } = userMiddleware;

router.route(USER_BY_ID_ROUTE).get(findOneById);
router.route('/').get(findOneBySlug);
router.route('/').post(checkCustomerPermission(Create), userModelValidation, addUser);
router.route('/').put(checkCustomerPermission(Update), updateUserValidation, updateUserInfo);
router.route(SEND_OTP_ROUTE).post(sendSmsOtpValidation, isPhoneNumberExists, sendSmsOtp);
router.route(VERIFY_OTP_ROUTE).post(verifySmsOtpValidation, verifySmsOTP, createUserPhone);
router.use(USER_ADDRESS_ROUTE, userAddressRoutes);
router.use(USER_RESET_PASSWORD_ROUTE, resetPassword);
router.route('/').get(checkAdminPermission(Read), findAll); //for admin

export const userRoutes = router;
