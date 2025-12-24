import { Router } from 'express';
import {
  createRating,
  getRatingsForUser,
  deleteRating
} from '../controllers/rating.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createRating);
router.get('/user/:userId', getRatingsForUser);
router.delete('/:id', authenticate, deleteRating);

export default router;
