import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { createPlantationUpdateSchema } from '../validators/update.validator';
import { uploadToCloudinary } from '../services/cloudinary.service';
import { createNotification } from '../services/notification.service';

export const listUpdates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = await db.plantationUpdate.findMany({
      orderBy: { update_date: 'desc' },
      include: {
        land: {
          include: { customer: true },
        },
      },
    });

    res.status(200).json(
      new ApiResponse(200, updates, 'Plantation updates retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const update = await db.plantationUpdate.findUnique({
      where: { id },
      include: {
        land: {
          include: { customer: true },
        },
      },
    });

    if (!update) {
      throw new ApiError(404, 'Plantation update not found');
    }

    res.status(200).json(
      new ApiResponse(200, update, 'Plantation update retrieved')
    );
  } catch (error) {
    next(error);
  }
};

export const createUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createPlantationUpdateSchema.parse(req.body);

    const land = await db.landPlot.findUnique({
      where: { id: validated.landId },
      include: { customer: true },
    });

    if (!land) {
      throw new ApiError(404, 'Associated land plot not found');
    }

    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.path, 'updates');
        images.push(url);
      }
    }

    const update = await db.plantationUpdate.create({
      data: {
        land_id: validated.landId,
        crop_id: validated.cropId || null,
        update_type: validated.updateType,
        title: validated.title,
        description: validated.description,
        images: images.join(','),
      },
    });

    // Send Notification to assigned customer
    if (land.customer && land.customer.user_id) {
      await createNotification({
        recipientId: land.customer.user_id,
        customerId: land.customer.id,
        title: `Plantation Update: ${validated.title}`,
        message: validated.description,
        type: 'UPDATE',
        link: '/portal/plantation',
        sendEmailAlert: validated.sendAlert || false,
      });
    }

    res.status(201).json(
      new ApiResponse(201, update, 'Plantation update created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.plantationUpdate.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Plantation update not found');
    }

    await db.plantationUpdate.delete({ where: { id } });

    res.status(200).json(
      new ApiResponse(200, null, 'Plantation update deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
