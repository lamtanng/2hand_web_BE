import express from 'express';
import { orderRequestController } from '../../controllers/orderRequest.controller';
import { orderRequestValidation } from '../../validations/orderRequest.validation';
const router = express.Router();

const { createValidation, replyValidation } = orderRequestValidation;
router.route('/').get(orderRequestController.findAll);
router.route('/').post(createValidation, orderRequestController.addOrderRequest);
router.route('/').put(replyValidation, orderRequestController.reply);

export const orderRequestRoutes = router;
