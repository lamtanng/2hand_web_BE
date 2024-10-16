import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { USER_ADDRESS_ROUTE, USER_ROUTE } from '../../../constants/routes';
import { userController } from '../../../controllers/user.controller';
import { checkRolePermission } from '../../../middlewares/auth.middleware';
import { userValidation } from '../../../validations/user.validation';
import { userAddressRoutes } from './address.routes';
const router = express.Router();

const { findAll, addUser, updateUserInfo, createReceiveAddress, updateAddress } = userController;
const { Read, Create, Update, Delete } = ActionPermission.User;

router.route('/').get(checkRolePermission(Read), findAll);
router.route('/').post(checkRolePermission(Create), userValidation, addUser);
router.route('/').put(checkRolePermission(Update), userValidation, updateUserInfo);
router.use(USER_ADDRESS_ROUTE, userAddressRoutes);

export const userRoutes = router;
