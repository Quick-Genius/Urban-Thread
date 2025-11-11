const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// Initialize Razorpay instance
let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('⚠️  Razorpay credentials not found in environment variables');
  } else {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize Razorpay:', error.message);
}

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    if (!razorpay) {
      console.error('Razorpay not initialized');
      return res.status(500).json({
        success: false,
        message: 'Payment service not configured. Please contact support.',
      });
    }

    const { amount, currency = 'INR' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order.id);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified, update order status
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'paid';
          order.paymentDetails = {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          };
          await order.save();
        }
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
});

// Get Razorpay key for frontend
router.get('/razorpay-key', (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

module.exports = router;
