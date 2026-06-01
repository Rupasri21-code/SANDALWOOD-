import { Router } from 'express';
import { getAdminStats, getCustomerStats } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.get('/admin', authorize('ADMIN'), getAdminStats);
router.get('/customer', authorize('CUSTOMER'), getCustomerStats);

export default router;
