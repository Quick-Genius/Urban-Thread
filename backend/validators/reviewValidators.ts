import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number({ required_error: 'Rating is required' }).int().min(1).max(5),
    comment: z.string({ required_error: 'Comment is required' }).min(1).max(2000).trim(),
  }),
  params: z.object({
    productId: z.string().min(1, 'Invalid product ID'),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(1).max(2000).trim().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Invalid review ID'),
  }),
});
