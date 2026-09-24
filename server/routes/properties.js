const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { protect, isHost } = require('../middleware/auth');

router.post('/', protect, isHost, propertyController.createProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

module.exports = router;
