import JWT, { PrivateKey, PublicKey, Secret, SignOptions } from 'jsonwebtoken';
import { UserProps } from '../types/user.type';

interface GenerateTokenProps {
  user: UserProps;
  secretKey: Secret | PrivateKey;
  expiresIn: SignOptions['expiresIn'];
}

const algorithm = 'RS256';

const generateToken = async ({ user, secretKey, expiresIn }: GenerateTokenProps) => {
  return JWT.sign(user, secretKey, { expiresIn: expiresIn, algorithm });
};

const verifyToken = async (token: string, secretKey: Secret | PublicKey) => {
  return JWT.verify(token, secretKey, { algorithms: [algorithm] });
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
