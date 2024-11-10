const express = require('express');
const { addMedical, getUserMedicals, updateMedical, deleteMedical } = require('../controllers/hospitalTaskController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Define routes
router.post('/', addMedical); // Create a new medical record
router.get('/', getUserMedicals); // Get all medical records for the logged-in user
router.put('/:id', updateMedical); // Update an existing medical record
router.delete('/:id', deleteMedical); // Delete a medical record by ID

module.exports = router;
