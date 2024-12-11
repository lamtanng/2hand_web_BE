import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { userController } from '../../../controllers/user.controller';
import { checkCustomerPermission } from '../../../middlewares/auth.middleware';
import { addressValidation } from '../../../validations/address.validation';
const router = express.Router();

const { createReceiveAddress, updateAddress, deleteAddress, getProvinces, getDistricts, getWards } =
  userController;
const { Update } = ActionPermission.User;
const { userAddress } = addressValidation;
router.route('/').post(checkCustomerPermission(Update), userAddress, createReceiveAddress);
router.route('/').put(checkCustomerPermission(Update), userAddress, updateAddress);
router.route('/').delete(checkCustomerPermission(Update), deleteAddress);
router.route('/provinces').get(getProvinces);
router.route('/districts').get(getDistricts);
router.route('/wards').get(getWards);

export const userAddressRoutes = router;
