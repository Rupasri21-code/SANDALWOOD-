import { Router } from 'express';
import {
  listInvestors,
  getInvestor,
  createInvestor,
  updateInvestor,
  deleteInvestor,
  generatePortalCredentials,
} from '../controllers/investor.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize('ADMIN'));

router.route('/')
  .get(listInvestors)
  .post(createInvestor);

router.route('/:id')
  .get(getInvestor)
  .put(updateInvestor)
  .delete(deleteInvestor);

router.post('/:id/credentials', generatePortalCredentials);

export default router;
