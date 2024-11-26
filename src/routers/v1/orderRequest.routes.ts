import express from 'express';
import { orderRequestController } from '../../controllers/orderRequest.controller';
import { orderRequestValidation } from '../../validations/orderRequest.validation';
import { orderRequestMiddleware } from '../../middlewares/orderRequesst.middleware';
const router = express.Router();

const { isReplied, isSended } = orderRequestMiddleware;
const { createValidation, replyValidation } = orderRequestValidation;
router.route('/').get(orderRequestController.findAll);
router.route('/').post(createValidation, isSended, orderRequestController.addOrderRequest);
router.route('/').put(replyValidation, isReplied, orderRequestController.replyByRequest);

export const orderRequestRoutes = router;
