import express from 'express';
import { cartController } from '../../../controllers/cart.controller';
import { cartValidation } from '../../../validations/cart.validation';
const router = express.Router();

const { addCart, findAll } = cartController;
router.route('/').get(findAll);
router.route('/').post(cartValidation, addCart);

export const cartRoutes = router;
