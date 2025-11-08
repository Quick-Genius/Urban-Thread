const express = require('express');
const { register, login, getMe, googleAuth, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
