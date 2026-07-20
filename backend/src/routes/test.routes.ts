import { Response, NextFunction } from 'express';
import { Router } from 'express';
import { protect, AuthRequest } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { 
  sendWhatsAppAccountCreated,
  sendWhatsAppPlotAssigned,
  sendWhatsAppPaymentReceived,
  sendWhatsAppPlantationUpdate,
  sendWhatsAppDocumentUploaded,
  sendWhatsAppKYCStatusUpdate,
  sendWhatsAppAdminBroadcast
} from '../services/whatsapp.service';

const router = Router();

// POST /api/v1/test/whatsapp
router.post('/whatsapp', protect, authorize('ADMIN'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { phone, type, message } = req.body;
    if (!phone) {
      throw new ApiError(400, 'Phone number is required');
    }

    let result;
    const dummyData = {
      plotName: 'Sandalwood Block A',
      location: 'Dornala, AP',
      area: '0.5 Acres',
      amount: '50,000',
      transactionId: 'TXN12345678',
      status: 'COMPLETED',
      cropName: 'Sandalwood Sapling',
      growthStage: 'SAPLING',
      healthStatus: 'EXCELLENT',
      survivingPlants: 180,
      totalPlants: 200,
      documentName: 'Land_Agreement.pdf',
      category: 'Agreement',
      kycStatus: 'VERIFIED',
      email: 'investor@example.com',
      password: 'SecurePassword123'
    };

    switch (type) {
      case 'credentials':
        result = await sendWhatsAppAccountCreated(phone, dummyData.email, dummyData.password);
        break;
      case 'plot':
        result = await sendWhatsAppPlotAssigned(phone, dummyData.plotName, dummyData.location, dummyData.area);
        break;
      case 'payment':
        result = await sendWhatsAppPaymentReceived(phone, dummyData.amount, dummyData.transactionId, dummyData.status);
        break;
      case 'plantation':
        result = await sendWhatsAppPlantationUpdate(
          phone, 
          dummyData.cropName, 
          dummyData.growthStage, 
          dummyData.healthStatus, 
          dummyData.survivingPlants, 
          dummyData.totalPlants
        );
        break;
      case 'document':
        result = await sendWhatsAppDocumentUploaded(phone, dummyData.documentName, dummyData.category);
        break;
      case 'kyc':
        result = await sendWhatsAppKYCStatusUpdate(phone, dummyData.kycStatus);
        break;
      case 'broadcast':
      default:
        result = await sendWhatsAppAdminBroadcast(phone, 'Test Notification', message || 'Test message from Chandhan Nilayam');
        break;
    }

    res.status(200).json(
      new ApiResponse(200, result, 'WhatsApp message sent successfully')
    );
  } catch (error: any) {
    if (error.message && error.message.includes('Twilio Sandbox')) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    } else {
      next(error);
    }
  }
});

export default router;
