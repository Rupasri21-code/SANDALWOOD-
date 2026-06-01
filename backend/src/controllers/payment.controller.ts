import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { z } from 'zod';

const createPaymentSchema = z.object({
  investmentId: z.string().optional(),
  customerId: z.string().min(1, 'Customer is required'),
  amount: z.number().min(0),
  currency: z.string().default('INR'),
  paymentType: z.string().min(1, 'Payment type is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
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
        customer: true,
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

export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        customer: true,
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

    const customer = await db.customerProfile.findUnique({ where: { id: validated.customerId } });
    if (!customer) {
      throw new ApiError(404, 'Customer profile not found');
    }

    const payment = await db.payment.create({
      data: {
        customer_id: validated.customerId,
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
