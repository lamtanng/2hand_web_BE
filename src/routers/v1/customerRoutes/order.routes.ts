import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import {
  ORDER_AVAILABLE_SERVICE_ROUTE,
  ORDER_DELIVERY_TIME_ROUTE,
  ORDER_PICKUP_ROUTE,
  ORDER_PLACE_ROUTE,
  ORDER_SHIPPING_FEE_ROUTE,
  ORDER_TRACKING_ROUTE,
} from '../../../constants/routes';
import { orderController } from '../../../controllers/order.controller';
import { checkCustomerPermission } from '../../../middlewares/auth.middleware';
import { orderMiddleware } from '../../../middlewares/order.middleware';
import { productMiddleware } from '../../../middlewares/product.middleware';
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
  tracking,
} = orderController;
const { Read, Create } = ActionPermission.Order;
const { isInStock } = productMiddleware;

router.route('/').get(checkCustomerPermission(Read), findAll);
router.route('/:_id').get(checkCustomerPermission(Read), findOneById);
router.route('/').post(checkCustomerPermission(Create), createOrder, addOrderWithMoMo);
router.route(ORDER_PLACE_ROUTE).post(isInStock, placeOrder);
router.route('/callback').post(isCheckout, addOrderWithMoMo);
router.route('/check_transaction').post(checkPaymentTransaction);
router.route(ORDER_SHIPPING_FEE_ROUTE).post(shippingValidation.calcShippingFee, calcShippingFee);
router
  .route(ORDER_AVAILABLE_SERVICE_ROUTE)
  .post(shippingValidation.getAvailableService, getAvailableService);
router.route(ORDER_PICKUP_ROUTE).post(getPickupDate);
router
  .route(ORDER_DELIVERY_TIME_ROUTE)
  .post(shippingValidation.calcExpectedDeliveryDate, calcExpectedDeliveryDate);
router.route(ORDER_TRACKING_ROUTE).get(tracking);

export const orderRoutes = router;
