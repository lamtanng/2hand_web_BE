import express from 'express';
import { categoryController } from '../../../controllers/category.controller';
import { categoryValidation } from '../../../validations/category.valiation';
const router = express.Router();

const { addCategoryValidation, updateCategoryValidation } = categoryValidation;
const { findAll, addCate, updateCate } = categoryController;
router.route('/').get(findAll);
router.route('/').post(addCategoryValidation, addCate);
router.route('/').put(updateCategoryValidation, updateCate);

export const categoryRoutes = router;
