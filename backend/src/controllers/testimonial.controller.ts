import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { createTestimonialSchema } from '../validators/testimonial.validator';

export const listTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await db.testimonial.findMany({
      where: {
        is_active: true
      },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json(
      new ApiResponse(200, testimonials, 'Testimonials retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createTestimonialSchema.parse(req.body);

    const testimonial = await db.testimonial.create({
      data: {
        name: validated.name,
        location: validated.location,
        investment: validated.investment,
        text: validated.text,
        rating: validated.rating || 5,
        image_url: validated.image_url,
      },
    });

    res.status(201).json(
      new ApiResponse(201, testimonial, 'Testimonial submitted successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await db.testimonial.delete({
      where: { id }
    });
    res.status(200).json(
      new ApiResponse(200, null, 'Testimonial deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
