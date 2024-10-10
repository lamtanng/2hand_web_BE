import express from 'express';
import { productController } from '../../../controllers/product.controller';
import { isAuthorized } from '../../../middlewares/auth.middleware';

const router = express.Router();
const { findAll, addProduct, updateProduct } = productController;

router.route('/').get(findAll);
router.route('/').post(isAuthorized, addProduct);
router.route('/').put(isAuthorized, updateProduct);

export const productRouter = router;
