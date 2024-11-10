// controllers/occasionController.js
const Occasion = require('../models/Occasion');

// Utility function to validate dateTime
const isValidDateTime = (dateTime) => {
    const now = new Date();
    return new Date(dateTime) > now; // Check if the dateTime is in the future
};

exports.addOccasion = async (req, res) => {
    const { title, dateTime, description } = req.body;

    // Validation for dateTime
    if (!isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'DateTime must be a valid future date.' });
    }

    try {
        const occasion = new Occasion({
            title,
            dateTime,
            description,
            user: req.user.id
        });
        await occasion.save();
        res.status(201).json(occasion);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create occasion', error });
    }
};

exports.getUserOccasions = async (req, res) => {
    try {
        const occasions = await Occasion.find({ user: req.user.id });
        res.json(occasions);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch occasions', error });
    }
};

exports.updateOccasion = async (req, res) => {
    const { title, dateTime, description } = req.body;

    // Validation for dateTime
    if (dateTime && !isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'DateTime must be a valid future date.' });
    }

    try {
        const occasion = await Occasion.findByIdAndUpdate(req.params.id, { title, dateTime, description }, { new: true });
        
        if (!occasion) {
            return res.status(404).json({ message: 'Occasion not found or unauthorized' });
        }

        res.json(occasion);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update occasion', error });
    }
};

exports.deleteOccasion = async (req, res) => {
    try {
        const occasion = await Occasion.findByIdAndDelete(req.params.id);
        
        if (!occasion) {
            return res.status(404).json({ message: 'Occasion not found or unauthorized' });
        }

        res.json({ message: 'Occasion deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete occasion', error });
    }
};
