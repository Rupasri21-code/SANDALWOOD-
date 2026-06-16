import { Router } from 'express';
import { login, refresh, logout, getMe, resetPassword, updateProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/refresh-token', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/reset-password', protect, resetPassword);
router.put('/profile', protect, updateProfile);

export default router;
