import { Response, NextFunction } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { z } from 'zod';

const createNotificationSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  investorId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ALERT', 'UPDATE']).default('INFO'),
  link: z.string().optional(),
});

export const listMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const notifications = await db.notification.findMany({
      where: { recipient_id: req.user.id },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json(
      new ApiResponse(200, notifications, 'Notifications retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const notif = await db.notification.findUnique({ where: { id } });
    if (!notif) {
      throw new ApiError(404, 'Notification not found');
    }

    const updated = await db.notification.update({
      where: { id },
      data: { is_read: true },
    });

    res.status(200).json(
      new ApiResponse(200, updated, 'Notification marked as read')
    );
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    await db.notification.updateMany({
      where: { recipient_id: req.user.id, is_read: false },
      data: { is_read: true },
    });

    res.status(200).json(
      new ApiResponse(200, null, 'All notifications marked as read')
    );
  } catch (error) {
    next(error);
  }
};

export const listAllNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await db.notification.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    res.status(200).json(
      new ApiResponse(200, notifications, 'Notifications retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { sendToAll, ...data } = req.body;
    
    if (sendToAll) {
      const investors = await db.investorProfile.findMany({
        where: { NOT: { user_id: null } }
      });
      
      const inserts = investors.map(inv => ({
        recipient_id: inv.user_id as string,
        investor_id: inv.id,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        link: data.link || null,
      }));
      
      if (inserts.length > 0) {
        await db.notification.createMany({ data: inserts });
      }
      
      return res.status(201).json(
        new ApiResponse(201, null, `Notification sent to ${inserts.length} investors`)
      );
    }
    
    const validated = createNotificationSchema.parse(data);
    
    const notif = await db.notification.create({
      data: {
        recipient_id: validated.recipientId,
        investor_id: validated.investorId || null,
        title: validated.title,
        message: validated.message,
        type: validated.type,
        link: validated.link || null,
      }
    });
    
    res.status(201).json(
      new ApiResponse(201, notif, 'Notification created successfully')
    );
  } catch (error) {
    next(error);
  }
};
