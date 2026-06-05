import { z } from 'zod';
import { sanitizedString, sanitizedEmail, sanitizedAlphaNum } from './sanitization';

export const createLandPlotSchema = z.object({
  title: sanitizedString().min(1, 'Title is required'),
  description: sanitizedString().min(1, 'Description is required'),
  location: sanitizedString().min(1, 'Location is required'),
  district: sanitizedString().min(1, 'District is required'),
  state: sanitizedString().min(1, 'State is required'),
  surveyNumber: sanitizedString().min(1, 'Survey number is required'),
  totalArea: z.union([z.number(), sanitizedString()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  unit: sanitizedString().default('Acres'),
  latitude: z.union([z.number(), sanitizedString()]).optional().transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  longitude: z.union([z.number(), sanitizedString()]).optional().transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  purchasePrice: z.union([z.number(), sanitizedString()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  currentValue: z.union([z.number(), sanitizedString()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'MAINTENANCE']).default('AVAILABLE'),
  investorId: sanitizedString().optional(),
}).superRefine((data, ctx) => {
  if (data.investorId && (!data.latitude || !data.longitude)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Latitude and Longitude are required before assigning the plot to an investor",
      path: ['latitude'],
    });
  }
});

export const updateLandPlotSchema = createLandPlotSchema;
