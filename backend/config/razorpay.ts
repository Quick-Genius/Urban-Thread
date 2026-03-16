import Razorpay from 'razorpay';
import logger from '../utils/logger';

let instance: Razorpay | null = null;

export const getRazorpay = (): Razorpay => {
  if (instance) return instance;

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    logger.error('Razorpay credentials not configured');
    throw new Error('Payment service is not configured');
  }

  instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  logger.info('Razorpay initialised');
  return instance;
};
