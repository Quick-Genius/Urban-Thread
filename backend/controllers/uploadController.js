const imagekit = require('../config/imagekit');

// @desc    Get ImageKit authentication parameters
// @route   GET /api/upload/auth
// @access  Private
exports.getAuthParams = async (req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.status(200).json({
      success: true,
      ...authenticationParameters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload image to ImageKit
// @route   POST /api/upload
// @access  Private
exports.uploadImage = async (req, res) => {
  try {
    const { file, fileName, folder } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    const uploadResponse = await imagekit.upload({
      file: file, // base64 string or file buffer
      fileName: fileName || `image_${Date.now()}`,
      folder: folder || '/products',
      useUniqueFileName: true,
    });

    res.status(200).json({
      success: true,
      data: {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: uploadResponse.name,
        thumbnailUrl: uploadResponse.thumbnailUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete image from ImageKit
// @route   DELETE /api/upload/:fileId
// @access  Private
exports.deleteImage = async (req, res) => {
  try {
    const { fileId } = req.params;

    await imagekit.deleteFile(fileId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultipleImages = async (req, res) => {
  try {
    const { files, folder } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided',
      });
    }

    const uploadPromises = files.map((file) =>
      imagekit.upload({
        file: file.data,
        fileName: file.name || `image_${Date.now()}`,
        folder: folder || '/products',
        useUniqueFileName: true,
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const uploadedImages = uploadResults.map((result) => ({
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      thumbnailUrl: result.thumbnailUrl,
    }));

    res.status(200).json({
      success: true,
      data: uploadedImages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
