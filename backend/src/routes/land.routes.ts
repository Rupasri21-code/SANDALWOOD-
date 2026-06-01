import { Router } from 'express';
import {
  listLandPlots,
  getLandPlot,
  createLandPlot,
  updateLandPlot,
  deleteLandPlot,
  assignPlot,
} from '../controllers/land.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(protect);

// Admin only actions
router.route('/')
  .get(listLandPlots)
  .post(authorize('ADMIN'), upload.array('images', 5), createLandPlot);

router.route('/:id')
  .get(getLandPlot)
  .put(authorize('ADMIN'), upload.array('images', 5), updateLandPlot)
  .delete(authorize('ADMIN'), deleteLandPlot);

router.post('/:id/assign', authorize('ADMIN'), assignPlot);

export default router;
