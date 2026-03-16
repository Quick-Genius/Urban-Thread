import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    phone: z.string().max(20).trim().optional().nullable(),
    avatar: z.string().max(500).optional(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(['customer', 'seller', 'admin'], {
      errorMap: () => ({ message: 'Role must be customer, seller, or admin' }),
    }),
  }),
  params: z.object({ id: z.string().min(1) }),
});
