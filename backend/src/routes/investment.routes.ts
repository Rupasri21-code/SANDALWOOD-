import { Router } from 'express';
import {
  listInvestments,
  listMyInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} from '../controllers/investment.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.get('/me', listMyInvestments);

router.route('/')
  .get(authorize('ADMIN'), listInvestments)
  .post(authorize('ADMIN'), createInvestment);

router.route('/:id')
  .get(getInvestment)
  .put(authorize('ADMIN'), updateInvestment)
  .delete(authorize('ADMIN'), deleteInvestment);

export default router;
