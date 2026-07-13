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
          include: { investor: true },
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

export const listMyUpdates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userReq = req as any;
    if (!userReq.user) throw new ApiError(401, 'Unauthorized');
    
    const profile = await db.investorProfile.findUnique({ where: { user_id: userReq.user.id } });
    if (!profile) throw new ApiError(404, 'Profile not found');

    const updates = await db.plantationUpdate.findMany({
      where: {
        land: {
          investor_id: profile.id
        }
      },
      orderBy: { update_date: 'desc' },
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
          include: { investor: true },
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
      include: { investor: true },
    });

    if (!land) {
      throw new ApiError(404, 'Associated land plot not found');
    }

    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.path, 'updates', file.mimetype);
        const url = uploadResult.url;
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

    // Send Notification to assigned investor
    if (land.investor && land.investor.user_id) {
      await createNotification({
        recipientId: land.investor.user_id,
        investorId: land.investor.id,
        title: `Plantation Update: ${validated.title}`,
        message: validated.description,
        type: 'UPDATE',
        link: '/portal/plantation',
        sendEmailAlert: validated.sendAlert !== false,
      });

      // WhatsApp Integration
      try {
        const { getInvestorWhatsAppNumber, sendWhatsAppPlantationUpdate, sendWhatsAppDocumentUploaded } = require('../services/whatsapp.service');
        const waPhone = getInvestorWhatsAppNumber(land.investor);
        
        if (waPhone) {
          // If crop ID is provided, try to fetch crop details for a full plantation update message
          if (validated.cropId) {
            const crop = await db.crop.findUnique({ where: { id: validated.cropId } });
            if (crop) {
              await sendWhatsAppPlantationUpdate(
                waPhone,
                crop.name || 'Sandalwood',
                crop.growth_stage || 'N/A',
                crop.health_status || 'N/A',
                crop.surviving_plants || 0,
                crop.total_plants || 0
              );
            }
          } else {
            // Fallback generic message using admin broadcast if crop isn't specified
            const { sendWhatsAppAdminBroadcast } = require('../services/whatsapp.service');
            await sendWhatsAppAdminBroadcast(
              waPhone,
              `Plantation Update: ${validated.title}`,
              validated.description
            );
          }

          // If photos were uploaded
          if (images.length > 0) {
            await sendWhatsAppDocumentUploaded(
              waPhone,
              `${images.length} new photo(s) attached to update`,
              'Plantation Update'
            );
          }
        }
      } catch (waErr: any) {
        console.error('WhatsApp sending failed for plantation update:', waErr.message || waErr);
      }
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
