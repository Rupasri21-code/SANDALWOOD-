import { Router } from 'express';
import { login, refresh, logout, getMe, resetPassword, updateProfile, forgotPassword, resetPasswordConfirm } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { loginLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/refresh-token', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/reset-password', protect, resetPassword);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', loginLimiter, forgotPassword);
router.post('/reset-password-confirm', loginLimiter, resetPasswordConfirm);

export default router;
