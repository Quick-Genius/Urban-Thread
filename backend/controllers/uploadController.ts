import imagekit from '../config/imagekit';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

export const getAuthParams = asyncHandler(async (_req, res) => {
  const params = imagekit.getAuthenticationParameters();
  res.status(200).json({ success: true, ...params });
});

export const uploadImage = asyncHandler(async (req, res) => {
  const { file, fileName, folder } = req.body;
  if (!file) throw new ApiError('No file provided', 400);

  const result = await imagekit.upload({
    file,
    fileName: fileName || `image_${Date.now()}`,
    folder: folder || '/products',
    useUniqueFileName: true,
  });

  res.status(200).json({
    success: true,
    data: { url: result.url, fileId: result.fileId, name: result.name, thumbnailUrl: result.thumbnailUrl },
  });
});

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  const { files, folder } = req.body;

  if (!Array.isArray(files) || files.length === 0) throw new ApiError('No files provided', 400);
  if (files.length > 10) throw new ApiError('Cannot upload more than 10 images at once', 400);

  const results = await Promise.all(
    files.map((f: { data: string; name?: string }) =>
      imagekit.upload({
        file: f.data,
        fileName: f.name || `image_${Date.now()}`,
        folder: folder || '/products',
        useUniqueFileName: true,
      }),
    ),
  );

  res.status(200).json({
    success: true,
    data: results.map((r) => ({ url: r.url, fileId: r.fileId, name: r.name, thumbnailUrl: r.thumbnailUrl })),
  });
});

export const deleteImage = asyncHandler(async (req, res) => {
  await imagekit.deleteFile(req.params.fileId);
  res.status(200).json({ success: true, message: 'Image deleted successfully' });
});
