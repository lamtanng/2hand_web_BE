import express from 'express';
import { orderController } from '../../../controllers/order.controller';
import { orderValidation } from '../../../validations/order.validation';
const router = express.Router();

const { sellerFindAll } = orderValidation;
const { findAll } = orderController;

router.route('/').get(sellerFindAll, findAll);

export const orderRoutes = router;
