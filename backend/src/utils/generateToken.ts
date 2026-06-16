import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role, type: 'access' }, env.JWT_ACCESS_SECRET!, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role, type: 'refresh' }, env.JWT_REFRESH_SECRET!, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET!) as { id: string; role: string; type?: string };
  // Check for backward compatibility with older tokens that do not have a type field
  if (decoded.type && decoded.type !== 'access') {
    throw new Error('Invalid token type for access');
  }
  return decoded;
};

export const verifyRefreshToken = (token: string) => {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET!) as { id: string; role: string; type: string };
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type for refresh');
  }
  return decoded;
};

