import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { createLandPlotSchema, updateLandPlotSchema } from '../validators/land.validator';
import { uploadToCloudinary } from '../services/cloudinary.service';
import { sendWhatsAppPlotAssigned, getInvestorWhatsAppNumber } from '../services/whatsapp.service';

export const listLandPlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plots = await db.landPlot.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        investor: true,
        crops: true,
      },
    });

    res.status(200).json(
      new ApiResponse(200, plots, 'Land plots retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const listMyLandPlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userReq = req as any; // auth middleware adds user
    if (!userReq.user) throw new ApiError(401, 'Unauthorized');
    
    const profile = await db.investorProfile.findUnique({ where: { user_id: userReq.user.id } });
    if (!profile) throw new ApiError(404, 'Profile not found');

    const plots = await db.landPlot.findMany({
      where: { investor_id: profile.id },
      orderBy: { created_at: 'desc' },
    });

    // Parse images since the frontend expects an array
    const formattedPlots = plots.map(p => ({
      ...p,
      images: p.images ? p.images.split(',') : []
    }));

    res.status(200).json(
      new ApiResponse(200, formattedPlots, 'Land plots retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getLandPlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const plot = await db.landPlot.findUnique({
      where: { id },
      include: {
        investor: true,
        crops: true,
        plantationUpdates: {
          orderBy: { update_date: 'desc' },
        },
      },
    });

    if (!plot) {
      throw new ApiError(404, 'Land plot not found');
    }

    res.status(200).json(
      new ApiResponse(200, plot, 'Land plot details retrieved')
    );
  } catch (error) {
    next(error);
  }
};

export const createLandPlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createLandPlotSchema.parse(req.body);

    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.path, 'lands', file.mimetype);
        const url = uploadResult.url;
        images.push(url);
      }
    }

    const plot = await db.landPlot.create({
      data: {
        title: validated.title,
        description: validated.description,
        location: validated.location,
        district: validated.district,
        state: validated.state,
        survey_number: validated.surveyNumber,
        total_area: validated.totalArea,
        unit: validated.unit,
        latitude: validated.latitude,
        longitude: validated.longitude,
        purchase_price: validated.purchasePrice,
        current_value: validated.currentValue,
        status: validated.status,
        investor_id: validated.investorId || null,
        images: images.join(','),
      },
    });

    if (plot.investor_id) {
      try {
        const investor = await db.investorProfile.findUnique({ where: { id: plot.investor_id } });
        if (investor) {
          const waPhone = getInvestorWhatsAppNumber(investor);
          if (waPhone) {
            await sendWhatsAppPlotAssigned(
              waPhone,
              plot.title || `Plot ${plot.passbook_number || ''}`,
              `${plot.location}, ${plot.district}`,
              `${plot.total_area} ${plot.unit || 'Acres'}`
            );
          }
        }
      } catch (waErr: any) {
        console.error('⚠️ Failed to send WhatsApp plot assigned notification:', waErr.message || waErr);
      }
    }

    res.status(201).json(
      new ApiResponse(201, plot, 'Land plot created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateLandPlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateLandPlotSchema.parse(req.body);

    const existing = await db.landPlot.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Land plot not found');
    }

    const images = existing.images ? existing.images.split(',') : [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.path, 'lands', file.mimetype);
        const url = uploadResult.url;
        images.push(url);
      }
    }

    const updated = await db.landPlot.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        location: validated.location,
        district: validated.district,
        state: validated.state,
        survey_number: validated.surveyNumber,
        total_area: validated.totalArea,
        unit: validated.unit,
        latitude: validated.latitude,
        longitude: validated.longitude,
        purchase_price: validated.purchasePrice,
        current_value: validated.currentValue,
        status: validated.status,
        investor_id: validated.investorId !== undefined ? (validated.investorId || null) : existing.investor_id,
        images: images.join(','),
      },
    });

    if (updated.investor_id && updated.investor_id !== existing.investor_id) {
      try {
        const investor = await db.investorProfile.findUnique({ where: { id: updated.investor_id } });
        if (investor) {
          const waPhone = getInvestorWhatsAppNumber(investor);
          if (waPhone) {
            await sendWhatsAppPlotAssigned(
              waPhone,
              updated.title || `Plot ${updated.passbook_number || ''}`,
              `${updated.location}, ${updated.district}`,
              `${updated.total_area} ${updated.unit || 'Acres'}`
            );
          }
        }
      } catch (waErr: any) {
        console.error('⚠️ Failed to send WhatsApp plot assigned notification:', waErr.message || waErr);
      }
    }

    res.status(200).json(
      new ApiResponse(200, updated, 'Land plot updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteLandPlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.landPlot.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Land plot not found');
    }

    await db.landPlot.delete({ where: { id } });

    res.status(200).json(
      new ApiResponse(200, null, 'Land plot deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const assignPlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { investorId } = req.body;

    const plot = await db.landPlot.findUnique({ where: { id } });
    if (!plot) {
      throw new ApiError(404, 'Land plot not found');
    }

    if (investorId) {
      const investor = await db.investorProfile.findUnique({ where: { id: investorId } });
      if (!investor) {
        throw new ApiError(404, 'Investor not found');
      }
    }

    const updated = await db.landPlot.update({
      where: { id },
      data: {
        investor_id: investorId || null,
        status: investorId ? 'SOLD' : 'AVAILABLE',
        purchase_date: investorId ? new Date() : null,
      },
    });

    if (investorId) {
      try {
        const investor = await db.investorProfile.findUnique({ where: { id: investorId } });
        if (investor) {
          const waPhone = getInvestorWhatsAppNumber(investor);
          if (waPhone) {
            await sendWhatsAppPlotAssigned(
              waPhone,
              updated.title || `Plot ${updated.passbook_number || ''}`,
              `${updated.location}, ${updated.district}`,
              `${updated.total_area} ${updated.unit || 'Acres'}`
            );
          }
        }
      } catch (waErr: any) {
        console.error('⚠️ Failed to send WhatsApp plot assigned notification:', waErr.message || waErr);
      }
    }

    res.status(200).json(
      new ApiResponse(200, updated, 'Plot assigned successfully')
    );
  } catch (error) {
    next(error);
  }
};
