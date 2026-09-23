const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.patch('/become-host', protect, userController.becomeHost);

module.exports = router;