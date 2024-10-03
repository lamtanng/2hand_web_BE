import express from 'express';
import { productController } from '../../controllers/product.controller';
const router = express.Router();

router.route('/').get(productController.findAll);
router.route('/').post(productController.addProduct);

export const productRoutes = router;
