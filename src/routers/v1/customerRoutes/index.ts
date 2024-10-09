import express from 'express';

import { CATEGORY_ROUTE, PRODUCT_ROUTE } from '../../../constants/routes';
import { productRouter } from './product.routes';
import { categoryRoutes } from './category.routes';

const router = express.Router();

// Children routes
router.use(CATEGORY_ROUTE, categoryRoutes);
router.use(PRODUCT_ROUTE, productRouter);

export const customerRouter = router;
