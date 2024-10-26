import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { orderController } from '../../../controllers/order.controller';
import { checkAdminPermission } from '../../../middlewares/auth.middleware';
const router = express.Router();

const { findAll, updateOrderStatus } = orderController;
const { Read, Update } = ActionPermission.Order;

router.route('/').get(checkAdminPermission(Read), findAll);
router.route('/status').patch(checkAdminPermission(Update), updateOrderStatus);

export const orderRoutes = router;
