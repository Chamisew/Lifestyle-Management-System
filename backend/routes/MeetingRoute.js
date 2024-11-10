const express = require('express');
const { addMeeting, getUserMeetings, editMeeting, deleteMeeting } = require('../controllers/MeetingController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Route to add a meeting
router.post('/', addMeeting);

// Route to get user's meetings
router.get('/', getUserMeetings);

// Route to edit a meeting
router.put('/:id', editMeeting);

// Route to delete a meeting
router.delete('/:id', deleteMeeting);

module.exports = router;
