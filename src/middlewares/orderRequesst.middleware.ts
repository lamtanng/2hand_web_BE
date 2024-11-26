import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { OrderRequestModel } from '../models/orderRequest';
import { OrderRequestDocument } from '../models/orderRequest/orderRequest.doc';
import { OrderStage } from '../types/enum/orderStage.enum';
import {
  CreateOrderRequestRequest,
  ReplyOrderRequestRequest,
} from '../types/http/orderRequest.type';
import { catchErrors, handleError } from '../utils/catchErrors';
import { OrderStageStatus } from '../types/enum/orderStageStatus.enum';

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
    return;
  }

  handleError({
    message: HttpMessage.ORDER_STAGE_CONDITION.REPLYING_REQUEST,
    statusCode: StatusCodes.BAD_REQUEST,
    next,
  });
});

const isSended = catchErrors(async (req, res, next) => {
  const { name, status } = req.body as CreateOrderRequestRequest;

  if (
    (name === OrderStage.Confirmating && status === OrderStageStatus.Active) ||
    (name === OrderStage.Picking && status === OrderStageStatus.Active) ||
    (name === OrderStage.Picking && status === OrderStageStatus.RequestToSeller)
  ) {
    next();
  } else
    handleError({
      message: HttpMessage.ORDER_STAGE_CONDITION.SENDING_REQUEST,
      statusCode: StatusCodes.BAD_REQUEST,
      next,
    });
});
export const orderRequestMiddleware = { isReplied, isSended };
