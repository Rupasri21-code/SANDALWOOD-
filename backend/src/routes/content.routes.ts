import { Router } from 'express';
import { getContentBySection, updateContent } from '../controllers/content.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.get('/:section', getContentBySection);
router.post('/', protect, authorize('ADMIN'), updateContent);

export default router;
