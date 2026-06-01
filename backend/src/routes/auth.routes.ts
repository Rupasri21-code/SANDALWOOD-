import { Router } from 'express';
import { login, getMe, resetPassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/reset-password', protect, resetPassword);

export default router;
