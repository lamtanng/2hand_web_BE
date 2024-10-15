import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { userController } from '../../../controllers/user.controller';
import { checkRolePermission } from '../../../middlewares/auth.middleware';
import { userAddressValidation, userValidation } from '../../../validations/user.validation';
const router = express.Router();

const { findAll, addUser, updateUserInfo, createReceiveAddress } = userController;
const { Read, Create, Update, Delete } = ActionPermission.User;

router.route('/').get(checkRolePermission(Read), findAll);
router.route('/').post(checkRolePermission(Create), userValidation, addUser);
router.route('/').put(checkRolePermission(Update), userValidation, updateUserInfo);

router
  .route('/address')
  .post(checkRolePermission(Update), userAddressValidation, createReceiveAddress);

export const userRoutes = router;
