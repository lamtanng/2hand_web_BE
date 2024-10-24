import express from 'express';
import { orderController } from '../../../controllers/order.controller';
import { isCheckout } from '../../../middlewares/order.middleware';
import { orderValidation } from '../../../validations/order.validation';
const router = express.Router();

const { addOrder, findAll, payByMomo, checkPaymentTransaction, findAllByUserID } = orderController;
router.route('/').get(findAll);
router.route('/:userID').get(findAllByUserID);
router.route('/').post(orderValidation, addOrder);
router.route('/place_order').post(payByMomo);
router.route('/callback').post(isCheckout, addOrder);
router.route('/check_transaction').post(checkPaymentTransaction);

export const orderRoutes = router;