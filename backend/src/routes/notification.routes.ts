import { Router } from 'express';
import { listMyNotifications, markAsRead, markAllAsRead, listAllNotifications, createNotification, deleteNotification, clearAllNotifications } from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.get('/', listMyNotifications);
router.patch('/:id/read', markAsRead);
router.post('/read-all', markAllAsRead);

// Admin Routes
router.get('/admin/all', authorize('ADMIN'), listAllNotifications);
router.post('/admin/create', authorize('ADMIN'), createNotification);
router.delete('/admin/clear-all', authorize('ADMIN'), clearAllNotifications);
router.delete('/admin/:id', authorize('ADMIN'), deleteNotification);

export default router;

