import { CreateReviewRequest } from '../types/http/review.type';
import { catchErrors } from '../utils/catchErrors';

const isDelivered = catchErrors(async (req, res, next) => {
  const { orderID } = req.body as CreateReviewRequest;
  // Check if the order stage is delivered

  //Check if there's time left for the review
  next();
});

export const reviewMiddleware = { isDelivered };
