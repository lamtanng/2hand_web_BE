import express from 'express';
import { orderController } from '../../controllers/order.controller';
const router = express.Router();

router.route('/').get(orderController.findAll);
router.route('/').post(orderController.addOrder);

export const orderRoutes = router;
