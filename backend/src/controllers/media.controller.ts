import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service';
import { sendWhatsAppDocumentUploaded, getInvestorWhatsAppNumber } from '../services/whatsapp.service';
import { sendDocumentAlert } from '../services/email.service';
import { createNotification } from '../services/notification.service';
import path from 'path';

export const listMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const media = await db.media.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        investor: true,
        land: true,
      },
    });

    res.status(200).json(
      new ApiResponse(200, media, 'Media items retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { investorId, landId, title, description, category } = req.body;

    if (!req.file) {
      throw new ApiError(400, 'Media file is required');
    }

    if (investorId !== 'ALL') {
      const investor = await db.investorProfile.findUnique({ where: { id: investorId } });
      if (!investor) {
        throw new ApiError(404, 'Investor profile not found');
      }
    }

    if (landId) {
      const land = await db.landPlot.findUnique({ where: { id: landId } });
      if (!land) {
        throw new ApiError(404, 'Land plot not found');
      }
    }

    const uploadResult = await uploadToCloudinary(req.file.path, 'media', req.file.mimetype);
    const fileUrl = uploadResult.url;
    const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();

    if (investorId === 'ALL') {
      const allInvestors = await db.investorProfile.findMany();
      if (allInvestors.length === 0) {
        throw new ApiError(400, 'No investors found to assign media to');
      }
      
      const media = await db.media.create({
        data: {
          investor_id: null,
          land_id: null,
          title: title || req.file!.originalname,
          description,
          file_url: fileUrl,
          file_type: fileType,
          category: category || 'General',
        },
      });

      // Broadcast to WhatsApp and Email
      for (const inv of allInvestors) {
        const email = inv.email || (inv.user_id ? (await db.user.findUnique({ where: { id: inv.user_id } }))?.email : null);
        
        // Create In-App notification & send email alert
        await createNotification({
          recipientId: inv.user_id || undefined,
          investorId: inv.id,
          title: 'New Media Asset Uploaded',
          message: `A new media asset "${title || req.file!.originalname}" (${category || 'General'}) has been added to your media gallery.`,
          type: 'INFO',
          link: '/portal/documents',
          sendEmailAlert: true,
        }).catch((e: any) => console.error(`Failed notification for ${inv.full_name}:`, e.message || e));

        const waPhone = getInvestorWhatsAppNumber(inv);
        if (waPhone) {
          try {
            await sendWhatsAppDocumentUploaded(waPhone, title || req.file!.originalname, category || 'General');
          } catch (waErr: any) {
            console.error(`WhatsApp broadcast to ${waPhone} failed:`, waErr.message || waErr);
          }
        }
      }

      res.status(201).json(
        new ApiResponse(201, media, `Media uploaded and assigned to all investors`)
      );
    } else {
      const media = await db.media.create({
        data: {
          investor_id: investorId,
          land_id: landId || null,
          title: title || req.file!.originalname,
          description,
          file_url: fileUrl,
          file_type: fileType,
          category: category || 'General',
        },
      });

      try {
        const investor = await db.investorProfile.findUnique({ where: { id: investorId } });
        if (investor) {
          await createNotification({
            recipientId: investor.user_id || undefined,
            investorId: investor.id,
            title: 'New Media Asset Uploaded',
            message: `A new media asset "${media.title}" (${media.category}) has been added to your gallery.`,
            type: 'INFO',
            link: '/portal/documents',
            sendEmailAlert: true,
          });

          const waPhone = getInvestorWhatsAppNumber(investor);
          if (waPhone) {
            await sendWhatsAppDocumentUploaded(waPhone, media.title, media.category);
          }
        }
      } catch (err: any) {
        console.error('Email/WhatsApp sending failed for media upload:', err.message || err);
      }

      res.status(201).json(
        new ApiResponse(201, media, 'Media uploaded successfully')
      );
    }
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.media.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Media item not found');
    }

    await deleteFromCloudinary(existing.file_url);
    await db.media.delete({ where: { id } });

    res.status(200).json(
      new ApiResponse(200, null, 'Media item deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
