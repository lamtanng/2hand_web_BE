import express from 'express';
import { ORDER_ROUTE } from '../../../constants/routes';
import { orderRoutes } from './order.routes';

const router = express.Router();

router.use(ORDER_ROUTE, orderRoutes);

export const sellerRouter = router;
