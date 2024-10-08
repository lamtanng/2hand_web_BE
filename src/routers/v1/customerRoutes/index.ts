import express from 'express';

import { PRODUCT_ROUTE } from '../../../constants/routes';
import { productRouter } from './product.routes';

const router = express.Router();

// Children routes
router.use(PRODUCT_ROUTE, productRouter);

export const customerRouter = router;
