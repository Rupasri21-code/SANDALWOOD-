import { z } from 'zod';
import { sanitizedString, sanitizedEmail } from './sanitization';

export const loginSchema = z.object({
  identifier: sanitizedString().min(1, 'Email or Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z.object({
  email: sanitizedEmail().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['ADMIN', 'INVESTOR']).default('INVESTOR'),
  fullName: sanitizedString().min(1, 'Full name is required'),
  phone: sanitizedString()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^\+?[0-9\s\-]{10,15}$/, 'Invalid phone number format'),
});

export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password must be at least 6 characters long'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});
