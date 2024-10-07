import express from 'express';
import { reviewController } from '../../controllers/review.controller';
import { reivewValidation } from '../../validations/review.validation';
const router = express.Router();

router.route('/').get(reviewController.findAll);
router.route('/').post(reivewValidation, reviewController.addReview);

export const reviewRoutes = router;
