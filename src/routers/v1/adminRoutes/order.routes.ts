import express from 'express';
import { orderController } from '../../../controllers/order.controller';
const router = express.Router();

const { findAll } = orderController;

router.route('/').get(findAll);

export const orderRoutes = router;
