import { Router } from 'express';
import {
  listPayments,
  listMyPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.get('/me', listMyPayments);

router.route('/')
  .get(authorize('ADMIN'), listPayments)
  .post(authorize('ADMIN'), createPayment);

router.route('/:id')
  .get(getPayment)
  .put(authorize('ADMIN'), updatePayment)
  .delete(authorize('ADMIN'), deletePayment);

export default router;
