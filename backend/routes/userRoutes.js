const express = require('express');
const {
  getUsers,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updatePassword);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
