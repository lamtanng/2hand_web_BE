import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { orderController } from '../../../controllers/order.controller';
import { checkCustomerPermission } from '../../../middlewares/auth.middleware';
import { orderMiddleware } from '../../../middlewares/order.middleware';
import { orderValidation } from '../../../validations/order.validation';
import { shippingValidation } from '../../../validations/shipping.validation';
const router = express.Router();

const { isCheckout } = orderMiddleware;
const { createOrder, customerFindAll } = orderValidation;
const { addOrder, findAll, payByMomo, checkPaymentTransaction, calcShippingFee } = orderController;
const { Read, Create } = ActionPermission.Order;

router.route('/').get(checkCustomerPermission(Read), customerFindAll, findAll);
router.route('/').post(checkCustomerPermission(Create), createOrder, addOrder);
router.route('/place_order').post(payByMomo);
router.route('/callback').post(isCheckout, addOrder);
router.route('/check_transaction').post(checkPaymentTransaction);
router.route('/calc_shipping_fee').post(shippingValidation.calcShippingFee, calcShippingFee);

export const orderRoutes = router;
