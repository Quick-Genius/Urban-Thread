import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';
import { paymentLimiter } from '../middleware/rateLimiter';
import { createRazorpayOrderSchema, verifyPaymentSchema } from '../validators/paymentValidators';

const router = Router();

router.get('/razorpay-key', protect, paymentController.getRazorpayKey);
router.post('/create-order', protect, paymentLimiter, validate(createRazorpayOrderSchema), paymentController.createOrder);
router.post('/verify-payment', protect, paymentLimiter, validate(verifyPaymentSchema), paymentController.verifyPayment);

export default router;
