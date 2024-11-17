import express from 'express';
import { categoryController } from '../../../controllers/category.controller';
import { categoryValidation } from '../../../validations/category.valiation';
import { CATEGORY_BY_ID_ROUTE, CATEGORY_BY_SLUG_ROUTE } from '../../../constants/routes';
const router = express.Router();

const { addCategoryValidation, updateCategoryValidation } = categoryValidation;
const { findAll, addCate, updateCate, findOneBySlug, findOneById } = categoryController;
router.route(CATEGORY_BY_ID_ROUTE).get(findOneById);
router.route(CATEGORY_BY_SLUG_ROUTE).get(findOneBySlug);
router.route('/').get(findAll);
router.route('/').post(addCategoryValidation, addCate);
router.route('/').put(updateCategoryValidation, updateCate);

export const categoryRoutes = router;
