import prisma from '../config/prisma';
import cache from '../config/redis';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

const LISTING_TTL = 300;
const DETAIL_TTL = 600;

export const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, sizes, rating, search, sort, page, limit } = req.query as Record<string, string | undefined>;

  const cacheKey = `products:list:${JSON.stringify(req.query)}`;
  const cached = await cache.get(cacheKey);
  if (cached) { res.status(200).json(cached); return; }

  const where: Record<string, unknown> = { isActive: true };

  if (category && category !== 'all') where.category = category;

  if (minPrice !== undefined || maxPrice !== undefined) {
    const price: Record<string, number> = {};
    if (minPrice !== undefined) price.gte = parseFloat(minPrice);
    if (maxPrice !== undefined) price.lte = parseFloat(maxPrice);
    where.price = price;
  }

  if (sizes) {
    const sizeArray = sizes.split(',').map((s) => s.trim()).filter(Boolean);
    if (sizeArray.length) where.sizes = { hasSome: sizeArray };
  }

  if (rating !== undefined) where.rating = { gte: parseFloat(rating) };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const sortMap: Record<string, Record<string, string>> = {
    'price-asc': { price: 'asc' },
    'price-desc': { price: 'desc' },
    rating: { rating: 'desc' },
    newest: { createdAt: 'desc' },
  };
  const orderBy = (sort && sortMap[sort]) || { createdAt: 'desc' };

  const pageNum = parseInt(page || '1', 10);
  const limitNum = parseInt(limit || '50', 10);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { seller: { select: { id: true, name: true } } },
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.product.count({ where }),
  ]);

  const response = {
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  };

  await cache.set(cacheKey, response, LISTING_TTL);
  res.status(200).json(response);
});

export const getProduct = asyncHandler(async (req, res) => {
  const cacheKey = `products:detail:${req.params.id}`;
  const cached = await cache.get(cacheKey);
  if (cached) { res.status(200).json(cached); return; }

  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { seller: { select: { id: true, name: true, email: true } } },
  });

  if (!product) throw new ApiError('Product not found', 404);

  const response = { success: true, product };
  await cache.set(cacheKey, response, DETAIL_TTL);
  res.status(200).json(response);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.create({
    data: { ...req.body, sellerId: req.user!.id },
  });
  await cache.delPattern('products:list:*');
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) throw new ApiError('Product not found', 404);

  if (product.sellerId !== req.user!.id && req.user!.role !== 'admin') {
    throw new ApiError('Not authorised to update this product', 403);
  }

  const { sellerId: _sid, ...updateData } = req.body;
  const updated = await prisma.product.update({ where: { id: req.params.id }, data: updateData });

  await Promise.all([
    cache.del(`products:detail:${req.params.id}`),
    cache.delPattern('products:list:*'),
  ]);

  res.status(200).json({ success: true, product: updated });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) throw new ApiError('Product not found', 404);

  if (product.sellerId !== req.user!.id && req.user!.role !== 'admin') {
    throw new ApiError('Not authorised to delete this product', 403);
  }

  await prisma.product.delete({ where: { id: req.params.id } });

  await Promise.all([
    cache.del(`products:detail:${req.params.id}`),
    cache.delPattern('products:list:*'),
  ]);

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});
