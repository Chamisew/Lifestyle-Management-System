// controllers/eventController.js
const Event = require('../models/Event');

// Utility function to validate dateTime
const isValidDateTime = (dateTime) => {
    const now = new Date();
    return new Date(dateTime) > now; // Check if the dateTime is in the future
};

exports.addEvent = async (req, res) => {
    const { title, dateTime, description } = req.body;

    // Validation for dateTime
    if (!isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'DateTime must be a valid future date.' });
    }

    try {
        const event = new Event({
            title,
            dateTime,
            description,
            user: req.user.id
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create event', error });
    }
};

exports.getUserEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id });
        res.json(events);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch events', error });
    }
};

exports.updateEvent = async (req, res) => {
    const { title, dateTime, description } = req.body;

    // Validation for dateTime
    if (dateTime && !isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'DateTime must be a valid future date.' });
    }

    try {
        const event = await Event.findByIdAndUpdate(req.params.id, { title, dateTime, description }, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update event', error });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete event', error });
    }
};
