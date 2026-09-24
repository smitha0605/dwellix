const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { protect, isHost } = require('../middleware/auth');

// IMPORTANT: this specific route must come BEFORE '/:id', otherwise
// Express will think "my" is an :id value and try to look up a property called "my"
router.get('/my/listings', protect, propertyController.getMyProperties);

router.post('/', protect, isHost, propertyController.createProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

module.exports = router;