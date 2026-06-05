import { z } from 'zod';
import { sanitizedString, sanitizedEmail, sanitizedAlphaNum } from './sanitization';

export const createPlantationUpdateSchema = z.object({
  landId: sanitizedString().min(1, 'Land plot association is required'),
  cropId: sanitizedString().optional(),
  updateType: sanitizedString().min(1, 'Update type category is required'),
  title: sanitizedString().min(1, 'Title is required'),
  description: sanitizedString().min(1, 'Description is required'),
  sendAlert: z.union([z.boolean(), sanitizedString()]).optional().transform((val) => val === true || val === 'true'),
});

export const updatePlantationUpdateSchema = createPlantationUpdateSchema.partial();
