import { z } from 'zod';

export const createLandPlotSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  surveyNumber: z.string().min(1, 'Survey number is required'),
  totalArea: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  unit: z.string().default('Acres'),
  latitude: z.union([z.number(), z.string()]).optional().transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  longitude: z.union([z.number(), z.string()]).optional().transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  purchasePrice: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  currentValue: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'MAINTENANCE']).default('AVAILABLE'),
  customerId: z.string().optional(),
});

export const updateLandPlotSchema = createLandPlotSchema.partial();
