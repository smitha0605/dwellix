const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, bookingController.createBooking);
router.get('/my', protect, bookingController.getMyBookings);

module.exports = router;