import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
// @ts-ignore
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let resourceType = 'auto';
    if (ext === '.mp4') {
      resourceType = 'video';
    } else if (['.pdf', '.doc', '.docx'].includes(ext)) {
      resourceType = 'raw'; // use 'raw' for non-media files
    }
    
    return {
      folder: 'sandalwood_uploads',
      resource_type: resourceType,
      public_id: file.fieldname + '-' + Date.now() + Math.round(Math.random() * 1e9),
    };
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.doc', '.docx', '.mp4'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only PNG, JPG, JPEG, GIF, PDF, DOC, DOCX, and MP4 are allowed.') as any, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
