import express from 'express';
import { categoryController } from '../../controllers/category.controller';
const router = express.Router();

router.route('/').get(categoryController.findAll);
router.route('/').post(categoryController.addCate);

export const categoryRoutes = router;
