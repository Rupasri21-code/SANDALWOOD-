import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { uploadToCloudinary } from '../services/cloudinary.service';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'File is required');
    }

    const uploadResult = await uploadToCloudinary(req.file.path, 'general', req.file.mimetype);

    res.status(201).json(
      new ApiResponse(201, uploadResult, 'File uploaded successfully')
    );
  } catch (error) {
    next(error);
  }
};
