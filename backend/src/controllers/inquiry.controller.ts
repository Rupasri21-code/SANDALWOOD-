import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { createInquirySchema, updateInquirySchema } from '../validators/inquiry.validator';
import { sendInquiryConfirmation } from '../services/email.service';

export const listInquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await db.inquiry.findMany({
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json(
      new ApiResponse(200, inquiries, 'Inquiries retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createInquirySchema.parse(req.body);

    const inquiry = await db.inquiry.create({
      data: {
        full_name: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        investment_interest: validated.investmentInterest,
        budget_range: validated.budgetRange,
        plot_size: validated.plotSize,
        message: validated.message,
      },
    });

    // Send confirmation email
    await sendInquiryConfirmation(validated.email, validated.fullName);

    res.status(201).json(
      new ApiResponse(201, inquiry, 'Inquiry submitted successfully. A confirmation email has been sent.')
    );
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateInquirySchema.parse(req.body);

    const existing = await db.inquiry.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Inquiry not found');
    }

    const updated = await db.inquiry.update({
      where: { id },
      data: {
        status: validated.status,
        admin_notes: validated.adminNotes,
      },
    });

    res.status(200).json(
      new ApiResponse(200, updated, 'Inquiry status updated successfully')
    );
  } catch (error) {
    next(error);
  }
};
