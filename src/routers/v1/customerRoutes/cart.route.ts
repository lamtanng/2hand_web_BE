import express from 'express';
import { cartController } from '../../../controllers/cart.controller';
import { cartValidation } from '../../../validations/cart.validation';
const router = express.Router();

router.route('/').get(cartController.findAll);
router.route('/').post(cartValidation, cartController.addCart);

export const cartRoutes = router;
