import express from 'express';
import { orderDetailController } from '../../controllers/orderDetail.controller';
import { orderDetailValidation } from '../../validations/orderDetail.validation';
const router = express.Router();

router.route('/').get(orderDetailController.findAll);
router.route('/').post(orderDetailValidation, orderDetailController.addOrderDetail);

export const orderDetailRoutes = router;
