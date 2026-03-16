import { z } from 'zod';

const CATEGORIES = ['men', 'women', 'kids', 'accessories'] as const;
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '4-6Y', '6-8Y', '8-10Y'] as const;
const SORT_OPTIONS = ['price-asc', 'price-desc', 'rating', 'newest'] as const;

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }).min(1).max(255).trim(),
    description: z.string().max(5000).trim().optional().default(''),
    price: z.number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' }).min(0),
    originalPrice: z.number().min(0).optional(),
    category: z.enum(CATEGORIES, {
      errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(', ')}` }),
    }),
    sizes: z.array(z.enum(SIZES, { errorMap: () => ({ message: 'Invalid size value' }) })).min(1).optional().default([]),
    images: z.array(z.string().min(1)).min(1, 'At least one image is required'),
    sku: z.string({ required_error: 'SKU is required' }).min(1).max(100).trim(),
    stock: z.number({ required_error: 'Stock is required', invalid_type_error: 'Stock must be a number' }).int().min(0),
    features: z.array(z.string().max(200)).optional().default([]),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).trim().optional(),
    description: z.string().max(5000).trim().optional(),
    price: z.number().min(0).optional(),
    originalPrice: z.number().min(0).optional().nullable(),
    category: z.enum(CATEGORIES).optional(),
    sizes: z.array(z.enum(SIZES)).optional(),
    images: z.array(z.string().min(1)).optional(),
    sku: z.string().min(1).max(100).trim().optional(),
    stock: z.number().int().min(0).optional(),
    features: z.array(z.string().max(200)).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Invalid product ID'),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    category: z.enum([...CATEGORIES, 'all'] as const).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sizes: z.string().optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    search: z.string().max(100).trim().optional(),
    sort: z.enum(SORT_OPTIONS).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  }).optional().default({}),
});
