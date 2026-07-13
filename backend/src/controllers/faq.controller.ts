import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { z } from 'zod';

const createFaqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export const listFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faqs = await db.faq.findMany({
      where: {
        is_active: true
      },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json(
      new ApiResponse(200, faqs, 'FAQs retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createFaqSchema.parse(req.body);

    const faq = await db.faq.create({
      data: {
        question: validated.question,
        answer: validated.answer,
      },
    });

    res.status(201).json(
      new ApiResponse(201, faq, 'FAQ created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await db.faq.delete({
      where: { id }
    });
    res.status(200).json(
      new ApiResponse(200, null, 'FAQ deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
