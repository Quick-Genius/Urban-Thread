const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        size: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'upi', 'cod'],
    },
    paymentDetails: {
      transactionId: String,
      paidAt: Date,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
