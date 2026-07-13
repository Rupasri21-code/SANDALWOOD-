import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { z } from 'zod';

const updateContentSchema = z.object({
  section: z.string(),
  content: z.record(z.string()),
});

export const getContentBySection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.params;
    const contents = await db.siteContent.findMany({
      where: { section },
    });

    const contentMap = contents.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    res.status(200).json(
      new ApiResponse(200, contentMap, 'Content retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = updateContentSchema.parse(req.body);
    const { section, content } = validated;

    // Use transaction for multiple upserts
    await db.$transaction(
      Object.entries(content).map(([key, value]) =>
        db.siteContent.upsert({
          where: { key },
          update: { value, section },
          create: { key, value, section },
        })
      )
    );

    res.status(200).json(
      new ApiResponse(200, null, 'Content updated successfully')
    );
  } catch (error) {
    next(error);
  }
};
