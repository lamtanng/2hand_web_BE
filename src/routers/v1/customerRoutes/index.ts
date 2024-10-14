import express from 'express';

import { CART_ROUTE, CATEGORY_ROUTE, PRODUCT_ROUTE } from '../../../constants/routes';
import { productRouter } from './product.routes';
import { categoryRoutes } from './category.routes';
import { cartRoutes } from './cart.routes';
import { isAuthorized } from '../../../middlewares/auth.middleware';

const router = express.Router();

// Children routes
router.use(CATEGORY_ROUTE, categoryRoutes);
router.use(PRODUCT_ROUTE, productRouter);
router.use(CART_ROUTE, isAuthorized, cartRoutes);

export const customerRouter = router;
