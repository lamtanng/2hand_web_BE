import express from 'express';
import { orderController } from '../../controllers/order.controller';
import { orderValidation } from '../../validations/order.validation';
const router = express.Router();

router.route('/').get(orderController.findAll);
router.route('/').post(orderValidation, orderController.addOrder);

export const orderRoutes = router;
