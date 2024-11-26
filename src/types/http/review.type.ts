import { OrderStage } from '../enum/orderStage.enum';
import { OrderStageProps } from '../model/orderStage.type';
import { ReviewProps } from '../model/review.type';

export interface CreateReviewRequest
  extends Pick<ReviewProps, 'content' | 'rate' | 'image' | 'video' | 'productID' | 'reviewerID'>,
    Pick<OrderStageProps, 'orderID'> {}
