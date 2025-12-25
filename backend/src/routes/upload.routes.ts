import { Router } from 'express';
import { upload } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { uploadProfilePhoto, uploadJobPhoto } from '../controllers/upload.controller';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// Upload profile photo
router.post('/profile-photo', upload.single('photo'), uploadProfilePhoto);

// Upload job photo
router.post('/job-photo', upload.single('photo'), uploadJobPhoto);

export default router;
