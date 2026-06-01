import { Response, NextFunction } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

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
