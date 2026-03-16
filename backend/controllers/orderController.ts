import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  const order = await prisma.$transaction(async (tx) => {
    // 1. Fetch product details and validate existence
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap[item.productId];
      if (!product || !product.isActive) {
        throw new ApiError(`Product not found: ${item.productId}`, 400);
      }
    }

    // 2. Atomically decrement stock — check AFTER decrement to prevent race conditions
    for (const item of items) {
      const updated = await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity }, sold: { increment: item.quantity } },
      });

      if (updated.stock < 0) {
        // Transaction will rollback automatically when we throw
        throw new ApiError(
          `Insufficient stock for "${productMap[item.productId].name}". Available: ${updated.stock + item.quantity}`,
          400,
        );
      }
    }

    // 3. Compute server-side totals
    const subtotal = items.reduce(
      (sum: number, item: { productId: string; quantity: number }) =>
        sum + productMap[item.productId].price * item.quantity,
      0,
    );
    const shippingCost = subtotal >= 999 ? 0 : 99;
    const discount = 0;
    const total = subtotal + shippingCost - discount;

    // 4. Create order with nested items and shipping address
    const newOrder = await tx.order.create({
      data: {
        userId: req.user!.id,
        paymentMethod,
        subtotal,
        shippingCost,
        discount,
        total,
        items: {
          create: items.map((item: { productId: string; size: string; quantity: number }) => ({
            productId: item.productId,
            name: productMap[item.productId].name,
            image: productMap[item.productId].images[0] ?? '',
            price: productMap[item.productId].price,
            size: item.size,
            quantity: item.quantity,
          })),
        },
        shippingAddress: { create: shippingAddress },
      },
      include: { items: true, shippingAddress: true },
    });

    // 5. Clear the user's cart
    const cart = await tx.cart.findUnique({ where: { userId: req.user!.id } });
    if (cart) {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return newOrder;
  });

  res.status(201).json({ success: true, order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
        shippingAddress: true,
        paymentDetail: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where: { userId: req.user!.id } }),
  ]);

  res.status(200).json({ success: true, count: orders.length, total, page, pages: Math.ceil(total / limit), orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: { select: { id: true, name: true, images: true } } } },
      shippingAddress: true,
      paymentDetail: true,
    },
  });

  if (!order) throw new ApiError('Order not found', 404);
  if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
    throw new ApiError('Not authorised to view this order', 403);
  }

  res.status(200).json({ success: true, order });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { id: true, name: true } } } },
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
