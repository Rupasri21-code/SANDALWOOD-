import { Router } from 'express';
import {
  listInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} from '../controllers/investment.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(listInvestments)
  .post(authorize('ADMIN'), createInvestment);

router.route('/:id')
  .get(getInvestment)
  .put(authorize('ADMIN'), updateInvestment)
  .delete(authorize('ADMIN'), deleteInvestment);

export default router;
