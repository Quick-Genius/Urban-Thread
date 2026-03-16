import crypto from 'crypto';
import { getRazorpay } from '../config/razorpay';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency } = req.body;
  const razorpay = getRazorpay();

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: currency || 'INR',
    receipt: `rcpt_${Date.now()}`,
  });

  res.status(200).json({ success: true, order });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const sigValid =
    expectedSign.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSign), Buffer.from(razorpay_signature));

  if (!sigValid) {
    throw new ApiError('Payment signature verification failed', 400);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError('Order not found', 404);
  if (order.userId !== req.user!.id) throw new ApiError('Not authorised to verify this payment', 403);

  await prisma.$transaction([
    prisma.paymentDetail.upsert({
      where: { orderId },
      create: { orderId, razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, paidAt: new Date() },
      update: { razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, paidAt: new Date() },
    }),
    prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'paid' } }),
  ]);

  res.status(200).json({ success: true, message: 'Payment verified successfully' });
});

export const getRazorpayKey = asyncHandler(async (_req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) throw new ApiError('Payment service is not configured', 503);
  res.status(200).json({ success: true, key: process.env.RAZORPAY_KEY_ID });
});
