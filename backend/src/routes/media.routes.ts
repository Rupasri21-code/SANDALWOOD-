import { Router } from 'express';
import { listMedia, createMedia, deleteMedia } from '../controllers/media.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(listMedia)
  .post(authorize('ADMIN'), upload.single('file'), createMedia);

router.route('/:id')
  .delete(authorize('ADMIN'), deleteMedia);

export default router;
