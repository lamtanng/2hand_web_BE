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
const {
  addOrderWithMoMo,
  findAll,
  checkPaymentTransaction,
  calcShippingFee,
  placeOrder,
  getAvailableService,
  getPickupDate,
  calcExpectedDeliveryDate,
  findOneById,
} = orderController;
const { Read, Create } = ActionPermission.Order;

router.route('/').get(checkCustomerPermission(Read), customerFindAll, findAll);
router.route('/:_id').get(checkCustomerPermission(Read), findOneById);
router.route('/').post(checkCustomerPermission(Create), createOrder, addOrderWithMoMo);
router.route('/place_order').post(placeOrder);
router.route('/callback').post(isCheckout, addOrderWithMoMo);
router.route('/check_transaction').post(checkPaymentTransaction);
router.route('/calc_shipping_fee').post(shippingValidation.calcShippingFee, calcShippingFee);
router
  .route('/available_service')
  .post(shippingValidation.getAvailableService, getAvailableService);
router.route('/pickup-date').get(getPickupDate);
router
  .route('/delivery-time')
  .post(shippingValidation.calcExpectedDeliveryDate, calcExpectedDeliveryDate);

export const orderRoutes = router;
