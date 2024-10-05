import express from 'express';
import { paymentMethodController } from '../../controllers/paymentMethod.controller';
const router = express.Router();

router.route('/').get(paymentMethodController.findAll);
router.route('/').post(paymentMethodController.addMethod);

export const paymentMethodRoutes = router;
