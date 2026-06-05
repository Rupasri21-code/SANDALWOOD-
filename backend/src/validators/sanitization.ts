import { z } from 'zod';

export const sanitizedString = () => z.string().trim().regex(/^[^<>]*$/, 'HTML tags are not allowed');
export const sanitizedEmail = () => z.string().trim().toLowerCase().regex(/^[^<>]*$/, 'HTML tags are not allowed');
export const sanitizedAlphaNum = () => z.string().trim().toUpperCase().regex(/^[A-Z0-9]*$/, 'Only alphanumeric characters allowed');
