import express from 'express';
import { productController } from '../../../controllers/product.controller';
import { isAuthorized } from '../../../middlewares/auth.middleware';

const router = express.Router();
const { findAll, addProduct, updateProduct, deleteProduct } = productController;

router.route('/').get(findAll);
router.route('/').post(isAuthorized, addProduct);
router.route('/').put(isAuthorized, updateProduct);
router.route('/').delete(isAuthorized, deleteProduct);

export const productRouter = router;
