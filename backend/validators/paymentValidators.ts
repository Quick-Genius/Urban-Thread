import { z } from 'zod';

export const createRazorpayOrderSchema = z.object({
  body: z.object({
    amount: z.number({ required_error: 'Amount is required' }).positive('Amount must be greater than 0'),
    currency: z.enum(['INR']).optional().default('INR'),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
    razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
    orderId: z.string().min(1, 'Order ID is required'),
  }),
});
