import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { OrderRequestModel } from '../models/orderRequest';
import { OrderRequestDocument } from '../models/orderRequest/orderRequest.doc';
import { OrderStage } from '../types/enum/orderStage.enum';
import { ReplyOrderRequestRequest } from '../types/http/orderRequest.type';
import { catchErrors, handleError } from '../utils/catchErrors';

const isReplied = catchErrors(async (req, res, next) => {
  const { _id } = req.body as ReplyOrderRequestRequest;
  const orderRequest = (await OrderRequestModel.findOne({ _id }).populate({
    path: 'orderStageStatusID',
    select: 'orderStageID',
    populate: { path: 'orderStageID', select: 'name' },
  })) as
    | (OrderRequestDocument & { orderStageStatusID: { orderStageID: { name: OrderStage } } })
    | null;

  const orderStageName = orderRequest?.orderStageStatusID?.orderStageID
    ?.name as unknown as OrderStage;

  if (orderStageName === OrderStage.Picking) {
    next();
  }

  handleError({
    message: HttpMessage.ORDER_STAGE_CONDITION.PICKING,
    statusCode: StatusCodes.BAD_REQUEST,
    next,
  });
});

export const orderRequestMiddleware = { isReplied };
