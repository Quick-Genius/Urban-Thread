import { z } from 'zod';

const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'InTransit', 'Delivered', 'Cancelled'] as const;
const PAYMENT_METHODS = ['card', 'upi', 'cod', 'razorpay'] as const;

const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100).trim(),
  phone: z.string().min(6, 'Phone is required').max(20).trim(),
  addressLine1: z.string().min(1, 'Address line 1 is required').max(255).trim(),
  addressLine2: z.string().max(255).trim().optional(),
  city: z.string().min(1, 'City is required').max(100).trim(),
  state: z.string().min(1, 'State is required').max(100).trim(),
  pinCode: z.string().min(4, 'PIN code is required').max(10).trim(),
});

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  size: z.string().min(1).max(20),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(PAYMENT_METHODS, {
      errorMap: () => ({ message: `Payment method must be one of: ${PAYMENT_METHODS.join(', ')}` }),
    }),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(ORDER_STATUSES, {
      errorMap: () => ({ message: `Status must be one of: ${ORDER_STATUSES.join(', ')}` }),
    }),
  }),
  params: z.object({
    id: z.string().min(1, 'Invalid order ID'),
  }),
});
