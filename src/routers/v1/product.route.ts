import express from 'express';
import { productController } from '../../controllers/product.controller';
import { productValidation } from '../../validations/product.valitdation';
const router = express.Router();

router.route('/').get(productController.findAll);
router.route('/').post(productValidation, productController.addProduct);

export const productRoutes = router;
