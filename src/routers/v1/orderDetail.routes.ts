import express from 'express';
import { orderDetailController } from '../../controllers/orderDetail.controller';
const router = express.Router();

router.route('/').get(orderDetailController.findAll);
router.route('/').post(orderDetailController.addOrderDetail);

export const orderDetailRoutes = router;
