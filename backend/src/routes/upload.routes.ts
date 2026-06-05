import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(protect);

router.post('/', authorize('ADMIN'), upload.single('file'), uploadFile);

export default router;
