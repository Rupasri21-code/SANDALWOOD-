import { z } from 'zod';
import { sanitizedString, sanitizedEmail } from './sanitization';

export const createInquirySchema = z.object({
  fullName: sanitizedString().min(1, 'Full name is required'),
  email: sanitizedEmail().min(1, 'Email is required').email('Invalid email address'),
  phone: sanitizedString().min(10, 'Phone must be at least 10 digits'),
  investmentInterest: sanitizedString().min(1, 'Investment interest category is required'),
  budgetRange: sanitizedString().min(1, 'Budget range is required'),
  plotSize: sanitizedString().min(1, 'Plot size preference is required'),
  message: sanitizedString().min(1, 'Message is required'),
});

export const updateInquirySchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'CLOSED']),
  adminNotes: sanitizedString().optional(),
});
