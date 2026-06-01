import { z } from 'zod';

export const createInquirySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  investmentInterest: z.string().min(1, 'Investment interest category is required'),
  budgetRange: z.string().min(1, 'Budget range is required'),
  plotSize: z.string().min(1, 'Plot size preference is required'),
  message: z.string().min(1, 'Message is required'),
});

export const updateInquirySchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'CLOSED']),
  adminNotes: z.string().optional(),
});
