import express from 'express';
import { reviewController } from '../../../controllers/review.controller';
import { reviewValidation } from '../../../validations/review.validation';
import { reviewMiddleware } from '../../../middlewares/review.middleware';
const router = express.Router();

const { createValidation } = reviewValidation;
const { isDelivered } = reviewMiddleware;

router.route('/').get(reviewController.findAll);
router.route('/').post(createValidation, isDelivered, reviewController.createOne);

export const reviewRoutes = router;
