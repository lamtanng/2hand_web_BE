import { ReviewProps } from '../model/review.type';

export interface CreateReviewRequest
  extends Pick<
    ReviewProps,
    'content' | 'rate' | 'image' | 'video' | 'productID' | 'reviewerID' | 'orderDetailID'
  > {}

export interface ReactToReviewRequest extends Pick<ReviewProps, '_id' | 'likes' | 'replyMessage'> {}
