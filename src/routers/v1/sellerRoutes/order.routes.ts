import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { orderController } from '../../../controllers/order.controller';
import { checkSellerPermission } from '../../../middlewares/auth.middleware';
import { orderValidation } from '../../../validations/order.validation';
const router = express.Router();

const { sellerFindAll } = orderValidation;
const { findAll } = orderController;
const { Read } = ActionPermission.Order;

router.route('/').get(checkSellerPermission(Read), sellerFindAll, findAll);

export const orderRoutes = router;
