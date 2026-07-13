import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  investment: z.string().optional(),
  text: z.string().min(1, 'Review text is required'),
  rating: z.number().min(1).max(5).optional(),
  image_url: z.string().url().optional().nullable(),
});
