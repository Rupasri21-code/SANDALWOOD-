import { Router } from 'express';
import {
  listCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
} from '../controllers/crop.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(listCrops)
  .post(authorize('ADMIN'), createCrop);

router.route('/:id')
  .get(getCrop)
  .put(authorize('ADMIN'), updateCrop)
  .delete(authorize('ADMIN'), deleteCrop);

export default router;
