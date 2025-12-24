import { Router } from 'express';
import {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
  getApplicationById
} from '../controllers/application.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize('WORKER'), createApplication);
router.get('/my-applications', authenticate, authorize('WORKER'), getMyApplications);
router.get('/:id', authenticate, getApplicationById);
router.put('/:id/status', authenticate, authorize('FARMER'), updateApplicationStatus);

export default router;
