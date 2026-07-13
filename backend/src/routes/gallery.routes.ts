import { Router } from 'express';
import { listGallery, createGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller';

const router = Router();

router.get('/', listGallery);
router.post('/', createGalleryItem);
router.delete('/:id', deleteGalleryItem);

export default router;
