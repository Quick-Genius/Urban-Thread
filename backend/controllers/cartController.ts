import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

const getPopulatedCart = (userId: string) =>
  prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, images: true, price: true, originalPrice: true, stock: true, isActive: true, sizes: true },
          },
        },
      },
    },
  });

export const getCart = asyncHandler(async (req, res) => {
  let cart = await getPopulatedCart(req.user!.id);
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user!.id },
      include: { items: { include: { product: true } } },
    });
  }
  res.status(200).json({ success: true, cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size } = req.body;

  let cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.user!.id } });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId_size: { cartId: cart.id, productId, size } },
  });

  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity, size } });
  }

  const updated = await getPopulatedCart(req.user!.id);
  res.status(200).json({ success: true, cart: updated });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
  if (!cart) throw new ApiError('Cart not found', 404);

  const item = await prisma.cartItem.findFirst({ where: { id: req.params.itemId, cartId: cart.id } });
  if (!item) throw new ApiError('Item not found in cart', 404);

  await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });

  const updated = await getPopulatedCart(req.user!.id);
  res.status(200).json({ success: true, cart: updated });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
  if (!cart) throw new ApiError('Cart not found', 404);

  const item = await prisma.cartItem.findFirst({ where: { id: req.params.itemId, cartId: cart.id } });
  if (!item) throw new ApiError('Item not found in cart', 404);

  await prisma.cartItem.delete({ where: { id: item.id } });

  const updated = await getPopulatedCart(req.user!.id);
  res.status(200).json({ success: true, cart: updated });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
  if (!cart) throw new ApiError('Cart not found', 404);

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  const updated = await getPopulatedCart(req.user!.id);
  res.status(200).json({ success: true, message: 'Cart cleared', cart: updated });
});
