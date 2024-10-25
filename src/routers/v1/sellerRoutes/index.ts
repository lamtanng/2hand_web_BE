import express from 'express';

import { ORDER_ROUTE, STORE_ROUTE } from '../../../constants/routes';
import { orderRoutes } from './order.routes';
import { storeRoutes } from './store.route';

const router = express.Router();

// Children routes
router.use(STORE_ROUTE, storeRoutes);
router.use(ORDER_ROUTE, orderRoutes);

export const sellerRouter = router;
