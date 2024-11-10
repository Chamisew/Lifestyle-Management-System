const express = require('express');
const { addEvent, getUserEvents, updateEvent, deleteEvent } = require('../controllers/EventController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Define routes
router.post('/', addEvent); // Create a new event
router.get('/', getUserEvents); // Get all events for the logged-in user
router.put('/:id', updateEvent); // Update an existing event
router.delete('/:id', deleteEvent); // Delete an event by ID

module.exports = router;
