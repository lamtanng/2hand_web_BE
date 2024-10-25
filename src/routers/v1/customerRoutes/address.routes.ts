import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { userController } from '../../../controllers/user.controller';
import { checkCustomerPermission } from '../../../middlewares/auth.middleware';
import { userAddressValidation } from '../../../validations/user.validation';
const router = express.Router();

const { createReceiveAddress, updateAddress, deleteAddress } = userController;
const { Read, Create, Update, Delete } = ActionPermission.User;

router
  .route('/')
  .post(checkCustomerPermission(Update), userAddressValidation, createReceiveAddress);
router.route('/').put(checkCustomerPermission(Update), userAddressValidation, updateAddress);
router.route('/:addressID').delete(checkCustomerPermission(Update), deleteAddress);

export const userAddressRoutes = router;
