import express from 'express';
import { cartController } from '../../../controllers/cart.controller';
import { cartValidation } from '../../../validations/cart.validation';
import { cartMiddleware } from '../../../middlewares/cart.middleware';
import { CART_ITEM_ROUTE } from '../../../constants/routes';
const router = express.Router();

const { addCartItem, findAll, removeCartItem, findOneItem } = cartController;
const { isInStock } = cartMiddleware;

router.route('/').get(findAll);
router.route(CART_ITEM_ROUTE).get(findOneItem);  
router.route('/').post(cartValidation, isInStock, addCartItem);
router.route('/').delete(removeCartItem);

export const cartRoutes = router;