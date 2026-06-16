import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { z } from 'zod';
import {
  sendWhatsAppInvestmentCreated,
  sendWhatsAppInvestmentStatusUpdated,
  getInvestorWhatsAppNumber,
} from '../services/whatsapp.service';

const createInvestmentSchema = z.object({
  investorId: z.string().min(1, 'Investor is required'),
  landId: z.string().optional(),
  investmentType: z.string().min(1, 'Investment type is required'),
  amount: z.number().min(0),
  currency: z.string().default('INR'),
  investmentDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  maturityDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  expectedReturns: z.number().min(0),
  roiPercentage: z.number().min(0),
  status: z.enum(['ACTIVE', 'MATURED', 'WITHDRAWN', 'PENDING']).default('PENDING'),
  contractNumber: z.string().min(1, 'Contract number is required'),
  notes: z.string().optional(),
});

export const listInvestments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const investments = await db.investment.findMany({
      orderBy: { investment_date: 'desc' },
      include: {
        investor: true,
        land: true,
      },
    });

    res.status(200).json(
      new ApiResponse(200, investments, 'Investments retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const listMyInvestments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userReq = req as any; // auth middleware adds user
    if (!userReq.user) throw new ApiError(401, 'Unauthorized');
    
    const profile = await db.investorProfile.findUnique({ where: { user_id: userReq.user.id } });
    if (!profile) throw new ApiError(404, 'Profile not found');

    const investments = await db.investment.findMany({
      where: { investor_id: profile.id },
      orderBy: { investment_date: 'desc' },
      include: {
        land: { select: { title: true } }
      }
    });

    res.status(200).json(
      new ApiResponse(200, investments, 'Investments retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getInvestment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const investment = await db.investment.findUnique({
      where: { id },
      include: {
        investor: true,
        land: true,
        payments: true,
      },
    });

    if (!investment) {
      throw new ApiError(404, 'Investment not found');
    }

    res.status(200).json(
      new ApiResponse(200, investment, 'Investment retrieved')
    );
  } catch (error) {
    next(error);
  }
};

export const createInvestment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createInvestmentSchema.parse(req.body);

    const investor = await db.investorProfile.findUnique({ where: { id: validated.investorId } });
    if (!investor) {
      throw new ApiError(404, 'Investor profile not found');
    }

    const investment = await db.investment.create({
      data: {
        investor_id: validated.investorId,
        land_id: validated.landId || null,
        investment_type: validated.investmentType,
        amount: validated.amount,
        currency: validated.currency,
        investment_date: validated.investmentDate,
        maturity_date: validated.maturityDate,
        expected_returns: validated.expectedReturns,
        roi_percentage: validated.roiPercentage,
        status: validated.status,
        contract_number: validated.contractNumber,
        notes: validated.notes,
      },
    });

    // WhatsApp: notify investor about their new investment record
    try {
      const waPhone = getInvestorWhatsAppNumber(investor);
      if (waPhone) {
        await sendWhatsAppInvestmentCreated(
          waPhone,
          investor.full_name,
          investment.investment_type,
          investment.amount,
          investment.contract_number,
          investment.roi_percentage
        );
      }
    } catch (waErr: any) {
      console.error('⚠️ Failed to send WhatsApp investment created notification:', waErr.message || waErr);
    }

    res.status(201).json(
      new ApiResponse(201, investment, 'Investment record created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateInvestment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = createInvestmentSchema.partial().parse(req.body);

    const existing = await db.investment.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Investment not found');
    }

    const updated = await db.investment.update({
      where: { id },
      data: {
        land_id: validated.landId !== undefined ? (validated.landId || null) : existing.land_id,
        investment_type: validated.investmentType,
        amount: validated.amount,
        currency: validated.currency,
        investment_date: validated.investmentDate,
        maturity_date: validated.maturityDate,
        expected_returns: validated.expectedReturns,
        roi_percentage: validated.roiPercentage,
        status: validated.status,
        contract_number: validated.contractNumber,
        notes: validated.notes,
      },
    });

    // WhatsApp: notify investor only when the status has changed
    if (validated.status && validated.status !== existing.status) {
      try {
        const investor = await db.investorProfile.findUnique({ where: { id: existing.investor_id } });
        if (investor) {
          const waPhone = getInvestorWhatsAppNumber(investor);
          if (waPhone) {
            await sendWhatsAppInvestmentStatusUpdated(
              waPhone,
              investor.full_name,
              updated.contract_number,
              existing.status,
              updated.status
            );
          }
        }
      } catch (waErr: any) {
        console.error('⚠️ Failed to send WhatsApp investment status update notification:', waErr.message || waErr);
      }
    }

    res.status(200).json(
      new ApiResponse(200, updated, 'Investment updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteInvestment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.investment.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Investment not found');
    }

    await db.investment.delete({ where: { id } });

    res.status(200).json(
      new ApiResponse(200, null, 'Investment deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
