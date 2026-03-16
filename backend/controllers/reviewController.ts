import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

const syncProductRating = async (productId: string) => {
  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 100) / 100,
      numReviews: agg._count.rating,
    },
  });
};

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError('Product not found', 404);

  const review = await prisma.review.create({
    data: { productId, userId: req.user!.id, rating, comment },
  });

  await syncProductRating(productId);
  res.status(201).json({ success: true, review });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) throw new ApiError('Review not found', 404);
  if (review.userId !== req.user!.id) throw new ApiError('Not authorised to update this review', 403);

  const updated = await prisma.review.update({
    where: { id: req.params.id },
    data: {
      ...(req.body.rating !== undefined && { rating: req.body.rating }),
      ...(req.body.comment !== undefined && { comment: req.body.comment }),
    },
  });

  await syncProductRating(review.productId);
  res.status(200).json({ success: true, review: updated });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) throw new ApiError('Review not found', 404);

  if (review.userId !== req.user!.id && req.user!.role !== 'admin') {
    throw new ApiError('Not authorised to delete this review', 403);
  }

  const { productId } = review;
  await prisma.review.delete({ where: { id: req.params.id } });
  await syncProductRating(productId);
  res.status(200).json({ success: true, message: 'Review deleted successfully' });
});
