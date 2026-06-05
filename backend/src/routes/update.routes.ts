import { Router } from 'express';
import {
  listUpdates,
  listMyUpdates,
  getUpdate,
  createUpdate,
  deleteUpdate,
} from '../controllers/update.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(protect);

router.get('/me', listMyUpdates);

router.route('/')
  .get(authorize('ADMIN'), listUpdates)
  .post(authorize('ADMIN'), upload.array('images', 3), createUpdate);

router.route('/:id')
  .get(getUpdate)
  .delete(authorize('ADMIN'), deleteUpdate);

export default router;
