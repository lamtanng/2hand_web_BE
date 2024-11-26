import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { OrderDetailModel } from '../models/orderDetail';
import { orderDetailDocument } from '../models/orderDetail/orderDetail.doc';
import { OrderStage } from '../types/enum/orderStage.enum';
import { CreateReviewRequest } from '../types/http/review.type';
import { OrderDetailProps } from '../types/model/orderDetail.type';
import { catchErrors, handleError } from '../utils/catchErrors';

const isDelivered = catchErrors(async (req, res, next) => {
  const { orderDetailID } = req.body as CreateReviewRequest;

  // Check if the order stage is delivered
  const orderDetails = (await OrderDetailModel.findById(orderDetailID).populate({
    path: 'orderID',
    populate: { path: 'orderStageID' },
  })) as unknown as OrderDetailProps & { orderID: { orderStageID: { name: string } } };

  const stage = orderDetails.orderID.orderStageID.name;
  if (stage !== OrderStage.Delivered) {
    handleError({
      message: HttpMessage.ORDER_STAGE_CONDITION.REVIEW_PRODUCT,
      statusCode: StatusCodes.BAD_REQUEST,
      next,
    });
    return;
  }

  //Check if there's time left for the review
  next();
});

export const reviewMiddleware = { isDelivered };
