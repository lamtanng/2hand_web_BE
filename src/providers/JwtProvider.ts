import JWT, { PrivateKey, PublicKey, Secret, SignOptions } from 'jsonwebtoken';
import { AccountProps } from '../types/account.type';

interface GenerateTokenProps {
  account: AccountProps;
  secretKey: Secret | PrivateKey;
  expiresIn: SignOptions['expiresIn'];
}

const generateToken = async ({ account, secretKey, expiresIn }: GenerateTokenProps) => {
  return JWT.sign(account, secretKey, { expiresIn: expiresIn, algorithm: 'RS256' });
};

const verifyToken = async (token: string, secretKey: Secret | PublicKey) => {
  return JWT.verify(token, secretKey);
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
