import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { z } from 'zod';
import {
  sendWhatsAppPaymentReceived,
  sendWhatsAppPaymentStatusUpdated,
  getInvestorWhatsAppNumber,
} from '../services/whatsapp.service';

const createPaymentSchema = z.object({
  investmentId: z.string().optional(),
  investorId: z.string().min(1, 'Investor is required'),
  amount: z.number().min(0),
  currency: z.string().default('INR'),
  paymentType: z.string().min(1, 'Payment type is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionId: z.string().min(8, 'Transaction ID must be at least 8 characters').regex(/^[a-zA-Z0-9-_]+$/, 'Transaction ID can only contain letters, numbers, hyphens, and underscores'),
  paymentDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  status: z.enum(['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED']).default('PENDING'),
  receiptUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const listPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await db.payment.findMany({
      orderBy: { payment_date: 'desc' },
      include: {
        investor: true,
        investment: true,
      },
    });

    res.status(200).json(
      new ApiResponse(200, payments, 'Payments retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const listMyPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userReq = req as any;
    if (!userReq.user) throw new ApiError(401, 'Unauthorized');
    
    const profile = await db.investorProfile.findUnique({ where: { user_id: userReq.user.id } });
    if (!profile) throw new ApiError(404, 'Profile not found');

    const payments = await db.payment.findMany({
      where: { investor_id: profile.id },
      orderBy: { payment_date: 'desc' },
    });

    res.status(200).json(
      new ApiResponse(200, payments, 'Payments retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        investor: true,
        investment: true,
      },
    });

    if (!payment) {
      throw new ApiError(404, 'Payment record not found');
    }

    res.status(200).json(
      new ApiResponse(200, payment, 'Payment record retrieved')
    );
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createPaymentSchema.parse(req.body);

    const investor = await db.investorProfile.findUnique({ where: { id: validated.investorId } });
    if (!investor) {
      throw new ApiError(404, 'Investor profile not found');
    }

    const payment = await db.payment.create({
      data: {
        investor_id: validated.investorId,
        investment_id: validated.investmentId || null,
        amount: validated.amount,
        currency: validated.currency,
        payment_type: validated.paymentType,
        payment_method: validated.paymentMethod,
        transaction_id: validated.transactionId,
        payment_date: validated.paymentDate,
        status: validated.status,
        receipt_url: validated.receiptUrl,
        notes: validated.notes,
      },
    });

    try {
      const waPhone = getInvestorWhatsAppNumber(investor);
      if (waPhone) {
        await sendWhatsAppPaymentReceived(
          waPhone,
          payment.amount.toString(),
          payment.transaction_id,
          payment.status
        );
      }
    } catch (waErr: any) {
      console.error('⚠️ Failed to send WhatsApp payment received notification:', waErr.message || waErr);
    }

    res.status(201).json(
      new ApiResponse(201, payment, 'Payment recorded successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = createPaymentSchema.partial().parse(req.body);

    const existing = await db.payment.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Payment record not found');
    }

    const updated = await db.payment.update({
      where: { id },
      data: {
        investment_id: validated.investmentId !== undefined ? (validated.investmentId || null) : existing.investment_id,
        amount: validated.amount,
        currency: validated.currency,
        payment_type: validated.paymentType,
        payment_method: validated.paymentMethod,
        transaction_id: validated.transactionId,
        payment_date: validated.paymentDate,
        status: validated.status,
        receipt_url: validated.receiptUrl,
        notes: validated.notes,
      },
    });

    // WhatsApp: notify investor only when the payment status has changed
    if (validated.status && validated.status !== existing.status) {
      try {
        const investor = await db.investorProfile.findUnique({ where: { id: existing.investor_id } });
        if (investor) {
          const waPhone = getInvestorWhatsAppNumber(investor);
          if (waPhone) {
            await sendWhatsAppPaymentStatusUpdated(
              waPhone,
              investor.full_name,
              updated.amount,
              updated.transaction_id,
              existing.status,
              updated.status
            );
          }
        }
      } catch (waErr: any) {
        console.error('⚠️ Failed to send WhatsApp payment status update notification:', waErr.message || waErr);
      }
    }

    res.status(200).json(
      new ApiResponse(200, updated, 'Payment updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.payment.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Payment record not found');
    }

    await db.payment.delete({ where: { id } });

    res.status(200).json(
      new ApiResponse(200, null, 'Payment deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
