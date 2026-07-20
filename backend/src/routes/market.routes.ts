import express from 'express';
import { getMarketPrice, updateMarketPrice } from '../controllers/market.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = express.Router();

router.get('/', getMarketPrice);
router.put('/admin/market-price', protect, authorize('ADMIN'), updateMarketPrice);

export default router;
