import { ReasonPhrases } from 'http-status-codes';

const getNotFoundMsg = (title: string) => `${title} ${ReasonPhrases.NOT_FOUND}`;

const EXPIRED_JWT_MGS = {
  ERROR: 'jwt expired',
  RESPONSE: 'Token has expired',
};
const NOT_FOUND = {
  USER: getNotFoundMsg('User'),
  TOKEN: getNotFoundMsg('Token'),
};

export const HttpMessage = { NOT_FOUND, EXPIRED_JWT_MGS };
