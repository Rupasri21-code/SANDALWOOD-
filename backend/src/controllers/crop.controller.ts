import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { z } from 'zod';

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
          include: { customer: true },
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

export const getCrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const crop = await db.crop.findUnique({
      where: { id },
      include: {
        land: {
          include: { customer: true },
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

    const existing = await db.crop.findUnique({ where: { id } });
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
