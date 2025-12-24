import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
} from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize('FARMER'), createJob);
router.get('/', getJobs);
router.get('/my-jobs', authenticate, authorize('FARMER'), getMyJobs);
router.get('/:id', getJobById);
router.put('/:id', authenticate, authorize('FARMER'), updateJob);
router.delete('/:id', authenticate, authorize('FARMER'), deleteJob);

export default router;
