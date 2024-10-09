import express from 'express';
import { categoryController } from '../../../controllers/category.controller';
import { categoryValidation } from '../../../validations/category.valiation';
const router = express.Router();

const { findAll, addCate } = categoryController;
router.route('/').get(findAll);
router.route('/').post(categoryValidation, addCate);

export const categoryRoutes = router;
