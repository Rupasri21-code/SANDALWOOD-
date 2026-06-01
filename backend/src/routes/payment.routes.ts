import { Router } from 'express';
import {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(listPayments)
  .post(authorize('ADMIN'), createPayment);

router.route('/:id')
  .get(getPayment)
  .put(authorize('ADMIN'), updatePayment)
  .delete(authorize('ADMIN'), deletePayment);

export default router;
