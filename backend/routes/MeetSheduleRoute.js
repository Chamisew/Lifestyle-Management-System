const express = require('express');
const router = express.Router();
const MeetScheduleController = require('../controllers/MeetSheduleController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Use authentication middleware for all routes
router.use(authenticateToken);

// Create a new schedule
router.post('/schedules', MeetScheduleController.addSchedule);

// Get all schedules
router.get('/schedules', MeetScheduleController.getSchedules);

// Get schedules by date
router.get('/schedules/by-date', MeetScheduleController.getScheduleByDate);

// Update a schedule by ID
router.put('/schedules/:id', MeetScheduleController.updateSchedule);

// Delete a schedule by ID
router.delete('/schedules/:id', MeetScheduleController.deleteSchedule);

module.exports = router;
