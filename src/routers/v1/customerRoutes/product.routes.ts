import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { productController } from '../../../controllers/product.controller';
import { isAuthorized } from '../../../middlewares/auth.middleware';
import { productMiddleware } from '../../../middlewares/product.middleware';
import { productValidation } from '../../../validations/product.valitdation';

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
const { updateProductValidation, createProductValidation } = productValidation;
const { Delete } = ActionPermission.Product;
const { isDeleted } = productMiddleware;

router.route('/').get(findAll);
router.route('/id/:productID').get(findOneById);
router.route('/slug/:productSlug').get(findOneBySlug);
router.route('/').post(isAuthorized, createProductValidation, addProduct);
router.route('/').put(isAuthorized, updateProductValidation, updateProduct);
router.route('/').delete(isAuthorized, isDeleted, deleteProduct);
router.route('/').patch(isAuthorized, toggleActiveProduct);

export const productRouter = router;
