import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number({ invalid_type_error: 'Quantity must be a number' }).int().min(1).max(100),
    size: z.string().min(1, 'Size is required').max(20).trim(),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number({ invalid_type_error: 'Quantity must be a number' }).int().min(1).max(100),
  }),
  params: z.object({
    itemId: z.string().min(1, 'Invalid item ID'),
  }),
});
