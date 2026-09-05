import { Router } from 'express';
import { listTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.get('/', listTestimonials);
router.post('/', protect, authorize('ADMIN'), createTestimonial);
router.delete('/:id', protect, authorize('ADMIN'), deleteTestimonial);

export default router;
