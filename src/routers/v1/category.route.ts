import express from 'express';
import { categoryController } from '../../controllers/category.controller';
import { categoryValidation } from '../../validations/category.valiation';
const router = express.Router();

router.route('/').get(categoryController.findAll);
router.route('/').post(categoryValidation, categoryController.addCate);

export const categoryRoutes = router;
