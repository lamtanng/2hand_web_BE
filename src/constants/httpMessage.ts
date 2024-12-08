import { ReasonPhrases } from 'http-status-codes';
import { OrderStage } from '../types/enum/orderStage.enum';

const TOKEN = 'Token';
const OTP = 'OTP';
const USER = 'User';
const PASSWORD = 'Password';
const NOT_VERIFY = "Your email hasn't been verified";
const OUT_OF_STOCK = 'Product is out of stock';
const ACCESS_DENIED = 'Access denied';
const ADDRESS = 'Address';
const PAYMENT_METHOD = 'Payment method';

const getNotFoundMsg = (title: string) => `${title} ${ReasonPhrases.NOT_FOUND}`;
const getConflictMsg = (title: string) => `${title} already exists`;
const getExpiredMsg = (title: string) => `${title} has expired`;
const getIncorrectMsg = (title: string) => `Incorrect ${title}`;
const getOrderStageConditionMsg = (orderStage: string) => `Stage's order must be ${orderStage}`;

const EXPIRED_MGS = {
  TOKEN: getExpiredMsg(TOKEN),
  OTP: getExpiredMsg(OTP),
};

const NOT_FOUND = {
  USER: getNotFoundMsg(USER),
  TOKEN: getNotFoundMsg(TOKEN),
  PAYMENT_METHOD: getNotFoundMsg(PAYMENT_METHOD),
  ADDRESS: getNotFoundMsg(ADDRESS).concat('or is default'),
};

const INCORRECT = {
  PASSWORD: getIncorrectMsg(PASSWORD),
  OTP: getIncorrectMsg(OTP),
};

const CONFLICT = {
  USER: getConflictMsg(USER),
};

const ORDER_STAGE_CONDITION = {
  REPLYING_REQUEST: getOrderStageConditionMsg(OrderStage.Picking),
  SENDING_REQUEST: getOrderStageConditionMsg(`${OrderStage.Picking} or ${OrderStage.Confirmating}`),
  REVIEW_PRODUCT: getOrderStageConditionMsg(`${OrderStage.Delivered}`),
};

export const HttpMessage = {
  NOT_FOUND,
  EXPIRED_MGS,
  INCORRECT,
  CONFLICT,
  NOT_VERIFY,
  OUT_OF_STOCK,
  ACCESS_DENIED,
  ORDER_STAGE_CONDITION,
};
