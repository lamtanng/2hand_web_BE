import express from 'express';

import { CATEGORY_ROUTE, PRODUCT_ROUTE, STORE_ROUTE } from '../../../constants/routes';
import { storeRoutes } from './store.route';

const router = express.Router();

// Children routes
router.use(STORE_ROUTE, storeRoutes);

export const sellerRouter = router;
