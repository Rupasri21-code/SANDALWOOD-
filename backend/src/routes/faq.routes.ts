import { Router } from 'express';
import { listFaqs, createFaq, deleteFaq } from '../controllers/faq.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.get('/', listFaqs);
router.post('/', protect, authorize('ADMIN'), createFaq);
router.delete('/:id', protect, authorize('ADMIN'), deleteFaq);

export default router;
