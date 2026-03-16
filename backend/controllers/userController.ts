import prisma from '../config/prisma';
import { bustUserCache } from '../middleware/auth';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.user.count(),
  ]);

  res.status(200).json({ success: true, count: users.length, total, page, pages: Math.ceil(total / limit), users });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) throw new ApiError('User not found', 404);
  res.status(200).json({ success: true, user });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (phone !== undefined) data.phone = phone;
  if (avatar !== undefined) data.avatar = avatar;

  const updated = await prisma.user.update({ where: { id: req.user!.id }, data });
  await bustUserCache(req.user!.clerkId);
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
