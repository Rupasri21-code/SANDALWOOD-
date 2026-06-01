import { z } from 'zod';

export const createPlantationUpdateSchema = z.object({
  landId: z.string().min(1, 'Land plot association is required'),
  cropId: z.string().optional(),
  updateType: z.string().min(1, 'Update type category is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  sendAlert: z.union([z.boolean(), z.string()]).optional().transform((val) => val === true || val === 'true'),
});

export const updatePlantationUpdateSchema = createPlantationUpdateSchema.partial();
