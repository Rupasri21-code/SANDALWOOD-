import { Router } from 'express';
import { listTestimonials, createTestimonial } from '../controllers/testimonial.controller';

const router = Router();

router.get('/', listTestimonials);
router.post('/', createTestimonial);

export default router;
