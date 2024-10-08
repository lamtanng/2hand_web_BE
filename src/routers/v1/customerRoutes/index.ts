import express from 'express';

import { CART_ROUTE, CATEGORY_ROUTE, PRODUCT_ROUTE } from '../../../constants/routes';
import { productRouter } from './product.routes';
import { categoryRoutes } from './category.routes';
import { cartRoutes } from './cart.route';

const router = express.Router();

// Children routes
router.use(CATEGORY_ROUTE, categoryRoutes);
router.use(PRODUCT_ROUTE, productRouter);
router.use(CART_ROUTE, cartRoutes);

export const customerRouter = router;
