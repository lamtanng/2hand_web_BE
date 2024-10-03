import express from 'express';
import { reviewController } from '../../controllers/review.controller';
const router = express.Router();

router.route('/').get(reviewController.findAll);
router.route('/').post(reviewController.addReview);

export const reviewRoutes = router;
