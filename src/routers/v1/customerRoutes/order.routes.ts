import express from 'express';
import { orderController } from '../../../controllers/order.controller';
import { orderValidation } from '../../../validations/order.validation';
const router = express.Router();

const { addOrder, findAll } = orderController;
router.route('/').get(findAll);
router.route('/').post(orderValidation, addOrder);

export const orderRoutes = router;
