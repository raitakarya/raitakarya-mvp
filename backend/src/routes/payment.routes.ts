import { Router } from 'express';
import {
  createPayment,
  releasePayment,
  getPaymentById
} from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize('FARMER'), createPayment);
router.put('/:id/release', authenticate, authorize('FARMER'), releasePayment);
router.get('/:id', authenticate, getPaymentById);

export default router;
