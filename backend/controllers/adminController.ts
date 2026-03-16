import prisma from '../config/prisma';
import cache from '../config/redis';
import { bustUserCache } from '../middleware/auth';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [totalProducts, totalUsers, totalOrders, revenueResult, salesByMonth, topCategories] =
    await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.$queryRaw`
        SELECT
          EXTRACT(YEAR  FROM "created_at")::int AS year,
          EXTRACT(MONTH FROM "created_at")::int AS month,
          SUM(total)::float                      AS sales,
          COUNT(*)::int                          AS count
        FROM orders
        WHERE "created_at" >= ${sixMonthsAgo}
        GROUP BY year, month
        ORDER BY year ASC, month ASC
      `,
      prisma.$queryRaw`
        SELECT
          category::text                              AS "_id",
          SUM(price * sold)::float                    AS revenue,
          COUNT(*)::int                               AS count
        FROM products
        GROUP BY category
        ORDER BY revenue DESC
        LIMIT 4
      `,
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalProducts,
      totalUsers,
      totalOrders,
      revenue: revenueResult._sum.total ?? 0,
      salesByMonth,
      topCategories,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  const usersWithCount = users.map(({ _count, ...u }) => ({ ...u, orderCount: _count.orders }));

  res.status(200).json({ success: true, count: usersWithCount.length, total, page, pages: Math.ceil(total / limit), users: usersWithCount });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role: req.body.role } });
  await bustUserCache(user.clerkId);
  res.status(200).json({ success: true, user });
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  if (req.params.id === req.user!.id) throw new ApiError('Cannot deactivate your own account', 400);

  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) throw new ApiError('User not found', 404);

  const updated = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: !user.isActive } });
  await bustUserCache(user.clerkId);
  res.status(200).json({ success: true, user: updated });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user!.id) throw new ApiError('Cannot delete your own account', 400);

  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) throw new ApiError('User not found', 404);

  await bustUserCache(user.clerkId);
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: { seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count(),
  ]);

  res.status(200).json({ success: true, count: products.length, total, page, pages: Math.ceil(total / limit), products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.create({ data: { ...req.body, sellerId: req.user!.id, isActive: true } });
  await cache.delPattern('products:list:*');
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { sellerId: _sid, ...updateData } = req.body;
  const product = await prisma.product.update({ where: { id: req.params.id }, data: updateData });
  await Promise.all([cache.del(`products:detail:${req.params.id}`), cache.delPattern('products:list:*')]);
  res.status(200).json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) throw new ApiError('Product not found', 404);

  await prisma.product.delete({ where: { id: req.params.id } });
  await Promise.all([cache.del(`products:detail:${req.params.id}`), cache.delPattern('products:list:*')]);
  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
        shippingAddress: true,
        paymentDetail: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count(),
  ]);

  res.status(200).json({ success: true, count: orders.length, total, page, pages: Math.ceil(total / limit), orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) throw new ApiError('Order not found', 404);

  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data: { status, ...(status === 'Delivered' && { deliveredAt: new Date() }) },
  });
  res.status(200).json({ success: true, order: updated });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) throw new ApiError('Order not found', 404);

  await prisma.order.delete({ where: { id: req.params.id } });
  res.status(200).json({ success: true, message: 'Order deleted successfully' });
});
