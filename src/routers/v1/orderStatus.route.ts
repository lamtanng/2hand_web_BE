import express from 'express';
import { orderStatusController } from '../../controllers/orderStatus.controller';
const router = express.Router();

router.route('/').get(orderStatusController.findAll);
router.route('/').post(orderStatusController.addStatus);

export const orderStatusRoutes = router;
