import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { USER_ADDRESS_ROUTE } from '../../../constants/routes';
import { userController } from '../../../controllers/user.controller';
import { checkRolePermission } from '../../../middlewares/auth.middleware';
import { userAddressValidation } from '../../../validations/user.validation';
const router = express.Router();

const { createReceiveAddress, updateAddress } = userController;
const { Read, Create, Update, Delete } = ActionPermission.User;

router
  .route(USER_ADDRESS_ROUTE)
  .post(checkRolePermission(Update), userAddressValidation, createReceiveAddress);
router
  .route(USER_ADDRESS_ROUTE)
  .put(checkRolePermission(Update), userAddressValidation, updateAddress);

export const userAddressRoutes = router;
