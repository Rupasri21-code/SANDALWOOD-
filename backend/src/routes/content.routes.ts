import { Router } from 'express';
import { getContentBySection, updateContent } from '../controllers/content.controller';

const router = Router();

router.get('/:section', getContentBySection);
router.post('/', updateContent);

export default router;
