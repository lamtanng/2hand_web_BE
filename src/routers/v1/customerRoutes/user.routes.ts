import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import {
  SEND_OTP_ROUTE,
  USER_ADDRESS_ROUTE,
  USER_BY_ID_ROUTE,
  USER_BY_SLUG_ROUTE,
  USER_ROUTE,
  VERIFY_OTP_ROUTE,
} from '../../../constants/routes';
import { userController } from '../../../controllers/user.controller';
import {
  checkAdminPermission,
  checkCustomerPermission,
} from '../../../middlewares/auth.middleware';
import { userAddressRoutes } from './address.routes';
import { otpMiddleware } from '../../../middlewares/otp.middleware';
import { userValidation } from '../../../validations/user.validation';
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
} = userController;
const { Read, Create, Update, Delete } = ActionPermission.User;
const { verifySmsOTP } = otpMiddleware;
const { userModelValidation, sendSmsOtpValidation, verifySmsOtpValidation, updateUserValidation } =
  userValidation;

router.route(USER_BY_ID_ROUTE).get(findOneById);
router.route('/').get(findOneBySlug);
router.route('/').post(checkCustomerPermission(Create), userModelValidation, addUser);
router.route('/').put(checkCustomerPermission(Update), updateUserValidation, updateUserInfo);
router.route(SEND_OTP_ROUTE).post(sendSmsOtpValidation, sendSmsOtp);
router.route(VERIFY_OTP_ROUTE).post(verifySmsOtpValidation, verifySmsOTP, createUserPhone);
router.use(USER_ADDRESS_ROUTE, userAddressRoutes);
router.route('/').get(checkAdminPermission(Read), findAll); //for admin

export const userRoutes = router;
