import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service';
import { createNotification } from '../services/notification.service';
import path from 'path';

export const listDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await db.document.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        investor: true,
        land: true,
      },
    });

    res.status(200).json(
      new ApiResponse(200, docs, 'Documents retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const listMyDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userReq = req as any; // auth middleware adds user
    if (!userReq.user) throw new ApiError(401, 'Unauthorized');
    
    const profile = await db.investorProfile.findUnique({ where: { user_id: userReq.user.id } });
    if (!profile) throw new ApiError(404, 'Profile not found');

    const docs = await db.document.findMany({
      where: { investor_id: profile.id },
      orderBy: { created_at: 'desc' },
    });

    const media = await db.media.findMany({
      where: { investor_id: profile.id },
      orderBy: { created_at: 'desc' },
    });

    const combined = [...docs, ...media].sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    );

    res.status(200).json(
      new ApiResponse(200, combined, 'Documents and media retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { investorId, landId, title, description, category, isPublic } = req.body;

    if (!req.file) {
      throw new ApiError(400, 'Document file is required');
    }

    const investor = await db.investorProfile.findUnique({
      where: { id: investorId },
      include: { user: true },
    });

    if (!investor) {
      throw new ApiError(404, 'Investor profile not found');
    }

    const uploadResult = await uploadToCloudinary(req.file.path, 'documents', req.file.mimetype);
    const fileUrl = uploadResult.url;
    const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();
    const fileSize = req.file.size;

    const doc = await db.document.create({
      data: {
        investor_id: investorId,
        land_id: landId || null,
        title: title || req.file.originalname,
        description,
        file_url: fileUrl,
        file_type: fileType,
        file_size: fileSize,
        category: category || 'Agreement',
        is_public: isPublic === 'true' || isPublic === true,
      },
    });

    // Alert Investor if portal access exists
    if (investor.user_id) {
      await createNotification({
        recipientId: investor.user_id,
        investorId: investor.id,
        title: 'New Document Shared',
        message: `An official document "${title}" has been uploaded to your investor portal.`,
        type: 'ALERT',
        link: '/portal/documents',
        sendEmailAlert: true,
      });
    }

    res.status(201).json(
      new ApiResponse(201, doc, 'Document uploaded successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.document.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Document not found');
    }

    await deleteFromCloudinary(existing.file_url);
    await db.document.delete({ where: { id } });

    res.status(200).json(
      new ApiResponse(200, null, 'Document deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
