import cloudinary from '../config/cloudinary';
import fs from 'fs';
import { env } from '../config/env';

export const uploadToCloudinary = async (filePath: string, folder: string = 'arborvest'): Promise<string> => {
  try {
    if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
      });
      // Delete local temporary file
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return result.secure_url;
    }

    // Mock fallback: Simulate an uploaded URL and return a placeholder
    console.log(`☁️ Cloudinary Upload (Mock Mode): Uploaded file ${filePath} to folder ${folder}`);
    const fileName = filePath.split(/[\\/]/).pop();
    
    // We return a mock URL. If it's a PDF, return standard PDF logo, else nature/sapling image
    const ext = fileName?.split('.').pop()?.toLowerCase();
    let mockUrl = 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=600';
    if (ext === 'pdf') {
      mockUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf.pdf';
    } else if (fileName?.toLowerCase().includes('sapling') || fileName?.toLowerCase().includes('crop')) {
      mockUrl = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600';
    } else if (fileName?.toLowerCase().includes('land') || fileName?.toLowerCase().includes('plot')) {
      mockUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600';
    }
    
    return mockUrl;
  } catch (error) {
    console.error('❌ Failed to upload to Cloudinary:', error);
    // Delete local temporary file on error
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};

export const deleteFromCloudinary = async (fileUrl: string): Promise<boolean> => {
  try {
    if (!env.CLOUDINARY_CLOUD_NAME) {
      console.log(`☁️ Cloudinary Delete (Mock Mode): Deleted file with URL ${fileUrl}`);
      return true;
    }
    
    // Extract public ID from Cloudinary URL
    const urlParts = fileUrl.split('/');
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExt.split('.')[0];
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('❌ Failed to delete from Cloudinary:', error);
    return false;
  }
};
