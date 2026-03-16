import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
  res.status(200).json({ success: true, count: addresses.length, addresses });
});

export const createAddress = asyncHandler(async (req, res) => {
  if (req.body.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }
  const address = await prisma.address.create({ data: { ...req.body, userId: req.user!.id } });
  res.status(201).json({ success: true, address });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!address) throw new ApiError('Address not found', 404);
  if (address.userId !== req.user!.id) throw new ApiError('Not authorised to update this address', 403);

  if (req.body.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }

  const { label, fullName, phone, addressLine1, addressLine2, city, state, pinCode, isDefault } = req.body;
  const updated = await prisma.address.update({
    where: { id: req.params.id },
    data: { label, fullName, phone, addressLine1, addressLine2, city, state, pinCode, isDefault },
  });
  res.status(200).json({ success: true, address: updated });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!address) throw new ApiError('Address not found', 404);
  if (address.userId !== req.user!.id) throw new ApiError('Not authorised to delete this address', 403);

  await prisma.address.delete({ where: { id: req.params.id } });
  res.status(200).json({ success: true, message: 'Address deleted successfully' });
});
