import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  console.error('❌ Error details:', err);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const fields = err.meta?.target || [];
    error = new ApiError(400, `Duplicate field value entered: ${fields.join(', ')}`);
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    error = new ApiError(404, 'Requested record was not found');
  }

  // Zod Validation Error (handled standardly)
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    error = new ApiError(400, 'Validation Failed', errors);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
