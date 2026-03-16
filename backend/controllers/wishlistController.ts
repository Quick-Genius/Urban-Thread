import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

const getWishlistItems = (userId: string) =>
  prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        select: { id: true, name: true, images: true, price: true, originalPrice: true, rating: true, isActive: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

export const getWishlist = asyncHandler(async (req, res) => {
  const items = await getWishlistItems(req.user!.id);
  res.status(200).json({ success: true, wishlist: { items } });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: req.user!.id, productId } },
  });
  if (existing) throw new ApiError('Product is already in your wishlist', 400);

  await prisma.wishlistItem.create({ data: { userId: req.user!.id, productId } });

  const items = await getWishlistItems(req.user!.id);
  res.status(200).json({ success: true, wishlist: { items } });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: req.user!.id, productId } },
  });
  if (!existing) throw new ApiError('Product not found in wishlist', 404);

  await prisma.wishlistItem.delete({
    where: { userId_productId: { userId: req.user!.id, productId } },
  });

  const items = await getWishlistItems(req.user!.id);
  res.status(200).json({ success: true, wishlist: { items } });
});
