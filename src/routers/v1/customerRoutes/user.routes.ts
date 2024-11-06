import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { USER_ADDRESS_ROUTE, USER_BY_ID_ROUTE, USER_ROUTE } from '../../../constants/routes';
import { userController } from '../../../controllers/user.controller';
import {
  checkAdminPermission,
  checkCustomerPermission,
} from '../../../middlewares/auth.middleware';
import { userValidation } from '../../../validations/user.validation';
import { userAddressRoutes } from './address.routes';
const router = express.Router();

const { findAll, addUser, updateUserInfo, findOneById, updateAddress } = userController;
const { Read, Create, Update, Delete } = ActionPermission.User;

router.route('/').get(checkAdminPermission(Read), findAll); //for admin
router.route(USER_BY_ID_ROUTE).get(findOneById);
router.route('/').post(checkCustomerPermission(Create), userValidation, addUser);
router.route('/').put(checkCustomerPermission(Update), userValidation, updateUserInfo);
router.use(USER_ADDRESS_ROUTE, userAddressRoutes);

export const userRoutes = router;
