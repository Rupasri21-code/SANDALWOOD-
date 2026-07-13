import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { z } from 'zod';

const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().default('image'),
  image_url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const listGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gallery = await db.galleryItem.findMany({
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json(
      new ApiResponse(200, gallery, 'Gallery retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createGallerySchema.parse(req.body);

    const item = await db.galleryItem.create({
      data: {
        title: validated.title,
        category: validated.category,
        type: validated.type,
        image_url: validated.image_url,
        description: validated.description,
      },
    });

    res.status(201).json(
      new ApiResponse(201, item, 'Gallery item created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await db.galleryItem.delete({
      where: { id }
    });
    res.status(200).json(
      new ApiResponse(200, null, 'Gallery item deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
