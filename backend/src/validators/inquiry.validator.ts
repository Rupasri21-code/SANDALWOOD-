import { z } from 'zod';
import { sanitizedString, sanitizedEmail } from './sanitization';

export const createInquirySchema = z.object({
  fullName: sanitizedString().min(1, 'Full name is required'),
  email: sanitizedEmail().min(1, 'Email is required').email('Invalid email address'),
  phone: sanitizedString()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^\+?[0-9\s\-]{10,15}$/, 'Invalid phone number format'),
  investmentInterest: sanitizedString().min(1, 'Investment interest category is required'),
  budgetRange: sanitizedString().min(1, 'Budget range is required'),
  plotSize: sanitizedString().min(1, 'Plot size preference is required'),
  message: sanitizedString().min(1, 'Message is required'),
});

export const updateInquirySchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'CLOSED']),
  adminNotes: sanitizedString().optional(),
});
