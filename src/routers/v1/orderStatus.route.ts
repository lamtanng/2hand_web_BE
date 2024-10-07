import express from 'express';
import { orderStatusController } from '../../controllers/orderStatus.controller';
import { orderStatusValidation } from '../../validations/orderStatus.validation';
const router = express.Router();

router.route('/').get(orderStatusController.findAll);
router.route('/').post(orderStatusValidation, orderStatusController.addStatus);

export const orderStatusRoutes = router;
