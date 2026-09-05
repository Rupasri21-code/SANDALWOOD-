import { Router } from 'express';
import { listGallery, createGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.get('/', listGallery);
router.post('/', protect, authorize('ADMIN'), createGalleryItem);
router.delete('/:id', protect, authorize('ADMIN'), deleteGalleryItem);

export default router;
