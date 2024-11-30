import express from 'express';
import { reviewController } from '../../../controllers/review.controller';
import { reviewValidation } from '../../../validations/review.validation';
import { reviewMiddleware } from '../../../middlewares/review.middleware';
const router = express.Router();

const { createValidation, reactToReviewValidation } = reviewValidation;
const { isDelivered } = reviewMiddleware;

router.route('/').get(reviewController.findAll);
router.route('/reviewer/:reviewerID').get(reviewController.findAllByReviewerID);
router.route('/product/:productID').get(reviewController.findAllByProductID);
router.route('/').post(createValidation, isDelivered, reviewController.createOne);
router.route('/').put(reactToReviewValidation, reviewController.reactToReview);

export const reviewRoutes = router;
