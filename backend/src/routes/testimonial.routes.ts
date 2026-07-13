import { Router } from 'express';
import { listTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';

const router = Router();

router.get('/', listTestimonials);
router.post('/', createTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
