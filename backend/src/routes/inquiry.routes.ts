import { Router } from 'express';
import { listInquiries, createInquiry, updateInquiryStatus } from '../controllers/inquiry.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public route to submit inquiry, rate-limited
router.post('/', apiLimiter, createInquiry);

// Admin-only routes to view/respond to inquiries
router.get('/', protect, authorize('ADMIN'), listInquiries);
router.put('/:id', protect, authorize('ADMIN'), updateInquiryStatus);

export default router;
