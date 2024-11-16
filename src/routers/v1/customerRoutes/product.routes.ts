import express from 'express';
import { productController } from '../../../controllers/product.controller';
import { checkSellerPermission, isAuthorized } from '../../../middlewares/auth.middleware';
import { ActionPermission } from '../../../constants/actionPermission';

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

const { Delete } = ActionPermission.Product;
router.route('/').get(findAll);
router.route('/id/:productID').get(findOneById);
router.route('/slug/:productSlug').get(findOneBySlug);
router.route('/').post(isAuthorized, addProduct);
router.route('/').put(isAuthorized, updateProduct);
router.route('/').delete(isAuthorized, checkSellerPermission(Delete), deleteProduct);
router.route('/').patch(isAuthorized, toggleActiveProduct);

export const productRouter = router;
