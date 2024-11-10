const express = require('express');
const { addOccasion, getUserOccasions, updateOccasion, deleteOccasion } = require('../controllers/OccasionController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Define routes
router.post('/', addOccasion); // Create a new occasion
router.get('/', getUserOccasions); // Get all occasions for the logged-in user
router.put('/:id', updateOccasion); // Update an existing occasion
router.delete('/:id', deleteOccasion); // Delete an occasion by ID

module.exports = router;
