const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/me', protect, (req, res) => {
  res.status(200).json({ message: 'You are authenticated', user: req.user });
});

module.exports = router;