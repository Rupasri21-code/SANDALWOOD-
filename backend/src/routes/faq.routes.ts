import { Router } from 'express';
import { listFaqs, createFaq, deleteFaq } from '../controllers/faq.controller';

const router = Router();

router.get('/', listFaqs);
router.post('/', createFaq);
router.delete('/:id', deleteFaq);

export default router;
