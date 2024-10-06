import express from 'express';
import { cartController } from '../../controllers/cart.controller';
const router = express.Router();

router.route('/').get(cartController.findAll);
router.route('/').post(cartController.addCart);

export const cartRoutes = router;
