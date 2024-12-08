import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { orderController } from '../../../controllers/order.controller';
import { checkCustomerPermission } from '../../../middlewares/auth.middleware';
import { orderMiddleware } from '../../../middlewares/order.middleware';
import { orderValidation } from '../../../validations/order.validation';
import { shippingValidation } from '../../../validations/shipping.validation';
import { productMiddleware } from '../../../middlewares/product.middleware';
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
  tracking,
} = orderController;
const { Read, Create } = ActionPermission.Order;
const { isInStock } = productMiddleware;

router.route('/').get(checkCustomerPermission(Read), findAll);
router.route('/:_id').get(checkCustomerPermission(Read), findOneById);
router.route('/').post(checkCustomerPermission(Create), createOrder, addOrderWithMoMo);
router.route('/place_order').post(isInStock, placeOrder);
router.route('/callback').post(isCheckout, addOrderWithMoMo);
router.route('/check_transaction').post(checkPaymentTransaction);
router.route('/calc_shipping_fee').post(shippingValidation.calcShippingFee, calcShippingFee);
router
  .route('/available_service')
  .post(shippingValidation.getAvailableService, getAvailableService);
router.route('/pickup-date').post(getPickupDate);
router
  .route('/delivery-time')
  .post(shippingValidation.calcExpectedDeliveryDate, calcExpectedDeliveryDate);
router.route('/tracking/:orderID').get(tracking);

export const orderRoutes = router;
