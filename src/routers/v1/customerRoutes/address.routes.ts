import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { userController } from '../../../controllers/user.controller';
import { checkRolePermission } from '../../../middlewares/auth.middleware';
import { userAddressValidation } from '../../../validations/user.validation';
const router = express.Router();

const { createReceiveAddress, updateAddress, deleteAddress } = userController;
const { Read, Create, Update, Delete } = ActionPermission.User;

router
  .route('/')
  .post(checkRolePermission(Update), userAddressValidation, createReceiveAddress);
router
  .route('/')
  .put(checkRolePermission(Update), userAddressValidation, updateAddress);
router.route('/:addressID').delete(checkRolePermission(Update), deleteAddress);

export const userAddressRoutes = router;
