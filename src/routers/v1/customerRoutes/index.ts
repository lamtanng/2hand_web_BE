import express from 'express';

import {
  CART_ROUTE,
  CATEGORY_ROUTE,
  ORDER_ROUTE,
  ORDER_STAGE_STATUS_ROUTE,
  ORDERREQUEST_ROUTE,
  ORDERSTAGE_ROUTE,
  PRODUCT_ROUTE,
  REVIEW_ROUTE,
  STORE_ROUTE,
  USER_ROUTE,
} from '../../../constants/routes';
import { productRouter } from './product.routes';
import { categoryRoutes } from './category.routes';
import { cartRoutes } from './cart.routes';
import { isAuthorized } from '../../../middlewares/auth.middleware';
import { userRoutes } from './user.routes';
import { orderRoutes } from './order.routes';
import { storeRoutes } from './store.routes';
import { orderStageRoutes } from './orderStage.routes';
import { orderStageStatusRoutes } from './orderStageStatus.routes';
import { orderRequestRoutes } from '../orderRequest.routes';
import { reviewRoutes } from './review.routes';

const router = express.Router();

// Children routes
router.use(CATEGORY_ROUTE, categoryRoutes);
router.use(PRODUCT_ROUTE, productRouter);
router.use(CART_ROUTE, isAuthorized, cartRoutes);
router.use(USER_ROUTE, userRoutes);
router.use(ORDER_ROUTE, isAuthorized, orderRoutes);
router.use(STORE_ROUTE, storeRoutes);
router.use(ORDERSTAGE_ROUTE, isAuthorized, orderStageRoutes);
router.use(ORDER_STAGE_STATUS_ROUTE, isAuthorized, orderStageStatusRoutes);
router.use(ORDERREQUEST_ROUTE, orderRequestRoutes);
router.use(REVIEW_ROUTE, reviewRoutes);

export const customerRouter = router;
