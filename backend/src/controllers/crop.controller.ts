import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { z } from 'zod';
import { sendWhatsAppPlantationUpdate, getInvestorWhatsAppNumber } from '../services/whatsapp.service';
import { createNotification } from '../services/notification.service';

const createCropSchema = z.object({
  landId: z.string().min(1, 'Land ID is required'),
  name: z.string().default('Sandalwood'),
  variety: z.string().min(1, 'Variety is required'),
  plantedDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  totalPlants: z.number().int().min(1),
  survivingPlants: z.number().int().min(0),
  growthStage: z.enum(['SEEDLING', 'SAPLING', 'JUVENILE', 'MATURE', 'HARVEST_READY']).default('SEEDLING'),
  heightAvg: z.number().default(0),
  healthStatus: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']).default('GOOD'),
  notes: z.string().optional(),
});

export const listCrops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crops = await db.crop.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        land: {
          include: { investor: true },
        },
      },
    });

    res.status(200).json(
      new ApiResponse(200, crops, 'Crops retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const listMyCrops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userReq = req as any;
    if (!userReq.user) throw new ApiError(401, 'Unauthorized');
    
    const profile = await db.investorProfile.findUnique({ where: { user_id: userReq.user.id } });
    if (!profile) throw new ApiError(404, 'Profile not found');

    const crops = await db.crop.findMany({
      where: {
        land: {
          investor_id: profile.id
        }
      },
      orderBy: { created_at: 'desc' },
      include: {
        land: { select: { title: true } }
      }
    });

    res.status(200).json(
      new ApiResponse(200, crops, 'Crops retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getCrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const crop = await db.crop.findUnique({
      where: { id },
      include: {
        land: {
          include: { investor: true },
        },
        plantationUpdates: {
          orderBy: { update_date: 'desc' },
        },
      },
    });

    if (!crop) {
      throw new ApiError(404, 'Crop record not found');
    }

    res.status(200).json(
      new ApiResponse(200, crop, 'Crop details retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createCrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createCropSchema.parse(req.body);

    const land = await db.landPlot.findUnique({ where: { id: validated.landId } });
    if (!land) {
      throw new ApiError(404, 'Associated land plot not found');
    }

    const crop = await db.crop.create({
      data: {
        land_id: validated.landId,
        name: validated.name,
        variety: validated.variety,
        planted_date: validated.plantedDate,
        total_plants: validated.totalPlants,
        surviving_plants: validated.survivingPlants,
        growth_stage: validated.growthStage,
        height_avg: validated.heightAvg,
        health_status: validated.healthStatus,
        notes: validated.notes,
      },
    });

    if (land.investor_id) {
      try {
        const investor = await db.investorProfile.findUnique({ where: { id: land.investor_id } });
        if (investor) {
          if (investor.user_id) {
            await createNotification({
              recipientId: investor.user_id,
              investorId: investor.id,
              title: 'New Crop Added to Plot',
              message: `A new crop (${crop.name} - ${crop.variety}) has been added to your plot.`,
              type: 'INFO',
              link: '/portal/plantation',
              sendEmailAlert: true,
            });
          }
          const waPhone = getInvestorWhatsAppNumber(investor);
          if (waPhone) {
            await sendWhatsAppPlantationUpdate(
              waPhone,
              crop.name,
              crop.growth_stage,
              crop.health_status,
              crop.surviving_plants,
              crop.total_plants
            );
          }
        }
      } catch (waErr: any) {
        console.error('⚠️ Failed to send WhatsApp plantation update notification:', waErr.message || waErr);
      }
    }

    res.status(201).json(
      new ApiResponse(201, crop, 'Crop record created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateCrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = createCropSchema.partial().parse(req.body);

    const existing = await db.crop.findUnique({
      where: { id },
      include: { land: true }
    });
    if (!existing) {
      throw new ApiError(404, 'Crop record not found');
    }

    const updated = await db.crop.update({
      where: { id },
      data: {
        name: validated.name,
        variety: validated.variety,
        planted_date: validated.plantedDate,
        total_plants: validated.totalPlants,
        surviving_plants: validated.survivingPlants,
        growth_stage: validated.growthStage,
        height_avg: validated.heightAvg,
        health_status: validated.healthStatus,
        notes: validated.notes,
      },
    });

    if (existing.land && existing.land.investor_id) {
      try {
        const investor = await db.investorProfile.findUnique({ where: { id: existing.land.investor_id } });
        if (investor) {
          if (investor.user_id) {
            await createNotification({
              recipientId: investor.user_id,
              investorId: investor.id,
              title: 'Crop Status Updated',
              message: `The status of your crop (${updated.name}) has been updated. Growth stage is now ${updated.growth_stage} with ${updated.health_status} health.`,
              type: 'INFO',
              link: '/portal/plantation',
              sendEmailAlert: true,
            });
          }
          const waPhone = getInvestorWhatsAppNumber(investor);
          if (waPhone) {
            await sendWhatsAppPlantationUpdate(
              waPhone,
              updated.name,
              updated.growth_stage,
              updated.health_status,
              updated.surviving_plants,
              updated.total_plants
            );
          }
        }
      } catch (waErr: any) {
        console.error('⚠️ Failed to send WhatsApp plantation update notification:', waErr.message || waErr);
      }
    }

    res.status(200).json(
      new ApiResponse(200, updated, 'Crop record updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.crop.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Crop record not found');
    }

    await db.crop.delete({ where: { id } });

    res.status(200).json(
      new ApiResponse(200, null, 'Crop record deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
