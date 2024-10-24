import express from 'express';
import { orderController } from '../../../controllers/order.controller';
import { orderMiddleware } from '../../../middlewares/order.middleware';
import { orderValidation } from '../../../validations/order.validation';
const router = express.Router();

const { checkRole, isCheckout } = orderMiddleware;
const { addOrder, findAll, payByMomo, checkPaymentTransaction } = orderController;

router.route('/').get(checkRole, findAll);
router.route('/').post(orderValidation, addOrder);
router.route('/place_order').post(payByMomo);
router.route('/callback').post(isCheckout, addOrder);
router.route('/check_transaction').post(checkPaymentTransaction);

export const orderRoutes = router;
