import express from 'express';

import {
  CART_ROUTE,
  CATEGORY_ROUTE,
  ORDER_ROUTE,
  PRODUCT_ROUTE,
  USER_ROUTE,
} from '../../../constants/routes';
import { productRouter } from './product.routes';
import { categoryRoutes } from './category.routes';
import { cartRoutes } from './cart.routes';
import { isAuthorized } from '../../../middlewares/auth.middleware';
import { userRoutes } from './user.routes';
import { orderRoutes } from './order.routes';

const router = express.Router();

// Children routes
router.use(CATEGORY_ROUTE, categoryRoutes);
router.use(PRODUCT_ROUTE, productRouter);
router.use(CART_ROUTE, isAuthorized, cartRoutes);
router.use(USER_ROUTE, isAuthorized, userRoutes);
router.use(ORDER_ROUTE, orderRoutes);

export const customerRouter = router;
