const express = require('express');
const router = express.Router();
const {
  getAuthParams,
  uploadImage,
  deleteImage,
  uploadMultipleImages,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/auth', getAuthParams);
router.post('/', uploadImage);
router.post('/multiple', uploadMultipleImages);
router.delete('/:fileId', deleteImage);

module.exports = router;
