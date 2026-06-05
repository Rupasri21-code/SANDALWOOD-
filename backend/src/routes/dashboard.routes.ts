import { Router } from 'express';
import { getAdminStats, getInvestorStats } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.get('/admin', authorize('ADMIN'), getAdminStats);
router.get('/investor', authorize('INVESTOR'), getInvestorStats);

export default router;
