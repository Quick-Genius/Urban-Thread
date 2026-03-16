import { z } from 'zod';

const addressBodySchema = z.object({
  label: z.string().min(1, 'Label is required').max(50).trim(),
  fullName: z.string().min(1, 'Full name is required').max(100).trim(),
  phone: z.string().min(6, 'Phone is required').max(20).trim(),
  addressLine1: z.string().min(1, 'Address line 1 is required').max(255).trim(),
  addressLine2: z.string().max(255).trim().optional(),
  city: z.string().min(1, 'City is required').max(100).trim(),
  state: z.string().min(1, 'State is required').max(100).trim(),
  pinCode: z.string().min(4, 'PIN code is required').max(10).trim(),
  isDefault: z.boolean().optional().default(false),
});

export const createAddressSchema = z.object({ body: addressBodySchema });

export const updateAddressSchema = z.object({
  body: addressBodySchema.partial(),
  params: z.object({ id: z.string().min(1, 'Invalid address ID') }),
});
