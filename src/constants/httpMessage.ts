import { ReasonPhrases } from 'http-status-codes';

const TOKEN = 'Token';
const OTP = 'OTP';
const USER = 'User';
const PASSWORD = 'Password';
const NOT_VERIFY = "Your email hasn't been verified";

const getNotFoundMsg = (title: string) => `${title} ${ReasonPhrases.NOT_FOUND}`;
const getConflictMsg = (title: string) => `${title} already exists`;
const getExpiredMsg = (title: string) => `${title} has expired`;
const getIncorrectMsg = (title: string) => `Incorrect ${title}`;

const EXPIRED_MGS = {
  TOKEN: getExpiredMsg(TOKEN),
  OTP: getExpiredMsg(OTP),
};

const NOT_FOUND = {
  USER: getNotFoundMsg(USER),
  TOKEN: getNotFoundMsg(TOKEN),
};

const INCORRECT = {
  PASSWORD: getIncorrectMsg(PASSWORD),
  OTP: getIncorrectMsg(OTP),
};

const CONFLICT = {
  USER: getConflictMsg(USER),
};

export const HttpMessage = { NOT_FOUND, EXPIRED_MGS, INCORRECT, CONFLICT, NOT_VERIFY };
