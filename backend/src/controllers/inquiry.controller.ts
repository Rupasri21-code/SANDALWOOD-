import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { createInquirySchema, updateInquirySchema } from '../validators/inquiry.validator';
import { sendInquiryConfirmation, sendAdminInquiryNotification, sendEmail } from '../services/email.service';
import { sendWhatsAppInquiryConfirmation } from '../services/whatsapp.service';

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

    // Send confirmation email to prospective investor
    await sendInquiryConfirmation(validated.email, validated.fullName).catch(err => console.error('Investor inquiry email failed:', err));
    
    // Send admin notification email
    await sendAdminInquiryNotification(inquiry).catch(err => console.error('Admin inquiry email failed:', err));
    
    // Send WhatsApp confirmation
    await sendWhatsAppInquiryConfirmation(validated.phone, validated.fullName).catch(err => console.error('WhatsApp sending failed:', err));

    res.status(201).json(
      new ApiResponse(201, inquiry, 'Inquiry submitted successfully. A confirmation message has been sent.')
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

    // Send status update email to the inquirer
    if (existing.email) {
      const emailSubject = `Update on Your Investment Inquiry - Chandhan Nilayam`;
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px;">
          <h2 style="color: #062E1F;">Investment Inquiry Update</h2>
          <p>Dear ${existing.full_name},</p>
          <p>The status of your investment inquiry submitted to Chandhan Nilayam has been updated to: <strong>${updated.status}</strong>.</p>
          ${updated.admin_notes ? `<blockquote style="background-color: #FFF8ED; border-left: 4px solid #C99A3A; padding: 10px 15px; margin: 15px 0;"><strong>Advisor Note:</strong> ${updated.admin_notes}</blockquote>` : ''}
          <p>Our advisor will be in touch with you shortly.</p>
          <hr style="border: 0; border-top: 1px solid #E7D7BC; margin: 20px 0;" />
          <p style="font-size: 12px; color: #1F1B16; opacity: 0.7;">Chandhan Nilayam Sandalwood Investments</p>
        </div>
      `;
      await sendEmail(existing.email, emailSubject, emailHtml).catch(err => console.error('Failed to send inquiry update email:', err));
    }

    res.status(200).json(
      new ApiResponse(200, updated, 'Inquiry status updated successfully')
    );
  } catch (error) {
    next(error);
  }
};
