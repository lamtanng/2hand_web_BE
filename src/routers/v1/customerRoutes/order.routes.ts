import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { orderController } from '../../../controllers/order.controller';
import { checkCustomerPermission } from '../../../middlewares/auth.middleware';
import { orderMiddleware } from '../../../middlewares/order.middleware';
import { orderValidation } from '../../../validations/order.validation';
const router = express.Router();

const { isCheckout } = orderMiddleware;
const { createOrder, customerFindAll } = orderValidation;
const { addOrder, findAll, payByMomo, checkPaymentTransaction } = orderController;
const { Read, Create } = ActionPermission.Order;

router.route('/').get(checkCustomerPermission(Read), customerFindAll, findAll);
router.route('/').post(checkCustomerPermission(Create), createOrder, addOrder);
router.route('/place_order').post(payByMomo);
router.route('/callback').post(isCheckout, addOrder);
router.route('/check_transaction').post(checkPaymentTransaction);

export const orderRoutes = router;
