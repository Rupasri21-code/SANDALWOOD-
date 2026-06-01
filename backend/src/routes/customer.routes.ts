import { Router } from 'express';
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  generatePortalCredentials,
} from '../controllers/customer.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize('ADMIN'));

router.route('/')
  .get(listCustomers)
  .post(createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

router.post('/:id/credentials', generatePortalCredentials);

export default router;
