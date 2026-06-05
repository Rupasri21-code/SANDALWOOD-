import { Router } from 'express';
import { listDocuments, createDocument, deleteDocument, listMyDocuments } from '../controllers/document.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(protect);

router.get('/me', listMyDocuments);

router.route('/')
  .get(authorize('ADMIN'), listDocuments)
  .post(authorize('ADMIN'), upload.single('file'), createDocument);

router.route('/:id')
  .delete(authorize('ADMIN'), deleteDocument);

export default router;
