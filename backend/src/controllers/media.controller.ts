import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service';
import path from 'path';

export const listMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const media = await db.media.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        customer: true,
        land: true,
      },
    });

    res.status(200).json(
      new ApiResponse(200, media, 'Media items retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, landId, title, description, category } = req.body;

    if (!req.file) {
      throw new ApiError(400, 'Media file is required');
    }

    const customer = await db.customerProfile.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new ApiError(404, 'Customer profile not found');
    }

    if (landId) {
      const land = await db.landPlot.findUnique({ where: { id: landId } });
      if (!land) {
        throw new ApiError(404, 'Land plot not found');
      }
    }

    const fileUrl = await uploadToCloudinary(req.file.path, 'media');
    const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();

    const media = await db.media.create({
      data: {
        customer_id: customerId,
        land_id: landId || null,
        title: title || req.file.originalname,
        description,
        file_url: fileUrl,
        file_type: fileType,
        category: category || 'General',
      },
    });

    res.status(201).json(
      new ApiResponse(201, media, 'Media uploaded successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.media.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Media item not found');
    }

    await deleteFromCloudinary(existing.file_url);
    await db.media.delete({ where: { id } });

    res.status(200).json(
      new ApiResponse(200, null, 'Media item deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
