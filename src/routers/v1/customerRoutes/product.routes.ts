import express from 'express';
import { productController } from '../../../controllers/product.controller';
import { isAuthorized } from '../../../middlewares/auth.middleware';

const router = express.Router();
const {
  findAll,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleActiveProduct,
  findOneById,
  findOneBySlug,
} = productController;

router.route('/').get(findAll);
router.route('/id/:productID').get(findOneById);
router.route('/slug/:productSlug').get(findOneBySlug);
router.route('/').post(isAuthorized, addProduct);
router.route('/').put(isAuthorized, updateProduct);
router.route('/').delete(isAuthorized, deleteProduct);
router.route('/').patch(isAuthorized, toggleActiveProduct);

export const productRouter = router;
