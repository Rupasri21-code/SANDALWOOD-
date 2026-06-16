import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/generateToken';
import { ApiError } from '../utils/ApiError';
import { db } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'ADMIN' | 'INVESTOR';
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, token required');
    }

    try {
      const decoded = verifyToken(token);
      
      const user = await db.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        throw new ApiError(401, 'User associated with token no longer exists');
      }

      req.user = user as { id: string; email: string; role: 'ADMIN' | 'INVESTOR' };
      next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access token expired');
      }
      throw new ApiError(401, 'Not authorized, invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};
