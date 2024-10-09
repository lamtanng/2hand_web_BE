import express from 'express';
import { productController } from '../../../controllers/product.controller';

const router = express.Router();
const { findAll, addProduct } = productController;

router.route('/').get(findAll);
router.route('/').post(addProduct);

export const productRouter = router;
