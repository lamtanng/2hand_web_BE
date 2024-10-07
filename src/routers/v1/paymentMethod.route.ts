import express from 'express';
import { paymentMethodController } from '../../controllers/paymentMethod.controller';
import { paymentMethodValidation } from '../../validations/paymentMethod.validation';
const router = express.Router();

router.route('/').get(paymentMethodController.findAll);
router.route('/').post(paymentMethodValidation, paymentMethodController.addMethod);

export const paymentMethodRoutes = router;
