import express from 'express';
import { orderRequestController } from '../../controllers/orderRequest.controller';
const router = express.Router();

router.route('/').get(orderRequestController.findAll);
router.route('/').post(orderRequestController.addOrderRequest);

export const orderRequestRoutes = router;
