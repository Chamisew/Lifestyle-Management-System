// controllers/meetingController.js
const Meeting = require('../models/Meeting');

// Utility function to validate dateTime
const isValidDateTime = (dateTime) => {
    const now = new Date();
    return new Date(dateTime) > now; // Check if the dateTime is in the future
};

const addMeeting = async (req, res) => {
    const { title, dateTime, description } = req.body;

    // Validation for dateTime
    if (!isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'DateTime must be a valid future date.' });
    }

    const meeting = new Meeting({
        user: req.user.id, // Get logged-in user ID
        title,
        dateTime,
        description
    });

    try {
        const createdMeeting = await meeting.save();
        res.status(201).json(createdMeeting);
    } catch (error) {
        res.status(400).json({ message: 'Invalid meeting data' });
    }
};

const getUserMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ user: req.user.id }).populate('user', 'name email');
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const editMeeting = async (req, res) => {
    const { title, dateTime, description } = req.body;
    const meetingId = req.params.id;

    // Validation for dateTime
    if (dateTime && !isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'DateTime must be a valid future date.' });
    }

    try {
        const updatedMeeting = await Meeting.findByIdAndUpdate(
            meetingId,
            { title, dateTime, description },
            { new: true, runValidators: true }
        );

        if (!updatedMeeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.json(updatedMeeting);
    } catch (error) {
        res.status(400).json({ message: 'Invalid meeting data' });
    }
};

const deleteMeeting = async (req, res) => {
    const meetingId = req.params.id;

    try {
        const meeting = await Meeting.findByIdAndDelete(meetingId);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addMeeting, getUserMeetings, editMeeting, deleteMeeting };
