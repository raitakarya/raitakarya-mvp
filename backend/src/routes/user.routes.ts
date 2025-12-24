import { Router } from 'express';
import {
  updateProfile,
  updateWorkerProfile,
  updateFarmerProfile,
  getUserById
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.put('/profile', authenticate, updateProfile);
router.put('/worker-profile', authenticate, authorize('WORKER'), updateWorkerProfile);
router.put('/farmer-profile', authenticate, authorize('FARMER'), updateFarmerProfile);
router.get('/:id', getUserById);

export default router;
