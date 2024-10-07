import express from 'express';
import { orderRequestController } from '../../controllers/orderRequest.controller';
import { orderRequestValidation } from '../../validations/orderRequest.validation';
const router = express.Router();

router.route('/').get(orderRequestController.findAll);
router.route('/').post(orderRequestValidation ,orderRequestController.addOrderRequest);

export const orderRequestRoutes = router;
