import { Router } from 'express';
import { listMyNotifications, markAsRead, markAllAsRead, listAllNotifications, createNotification } from '../controllers/notification.controller';
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

export default router;
