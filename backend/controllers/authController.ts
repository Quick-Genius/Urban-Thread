import asyncHandler from '../utils/asyncHandler';

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
