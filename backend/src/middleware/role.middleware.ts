import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ApiError } from '../utils/ApiError';

export const authorize = (...roles: ('ADMIN' | 'INVESTOR')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.some(r => r.toUpperCase() === req.user!.role.toUpperCase())) {
      return next(new ApiError(403, `User role '${req.user?.role}' is not authorized to access this route`));
    }
    next();
  };
};
