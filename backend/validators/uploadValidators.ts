import { z } from 'zod';

const ALLOWED_FOLDERS = ['/products', '/avatars', '/banners'] as const;

export const uploadImageSchema = z.object({
  body: z.object({
    file: z.string().min(1, 'File data is required'),
    fileName: z.string().max(100).regex(/^[a-zA-Z0-9._-]+$/, 'Invalid file name characters').optional(),
    folder: z.enum(ALLOWED_FOLDERS).optional().default('/products'),
  }),
});

export const uploadMultipleSchema = z.object({
  body: z.object({
    files: z.array(z.object({
      data: z.string().min(1),
      name: z.string().max(100).regex(/^[a-zA-Z0-9._-]+$/).optional(),
    })).min(1, 'At least one file required').max(10, 'Cannot upload more than 10 images'),
    folder: z.enum(ALLOWED_FOLDERS).optional().default('/products'),
  }),
});
