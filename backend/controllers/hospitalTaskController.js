// controllers/medicalController.js
const Medical = require('../models/HospitalTask');

// Utility function to validate dateTime
const isValidDateTime = (dateTime) => {
    const now = new Date();
    return new Date(dateTime) > now; // Check if the dateTime is in the future
};

exports.addMedical = async (req, res) => {
    const { title, dateTime, description } = req.body;

    // Validation for dateTime
    if (!isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'DateTime must be a valid future date.' });
    }

    try {
        const medical = new Medical({
            title,
            dateTime,
            description,
            user: req.user.id
        });
        await medical.save();
        res.status(201).json(medical);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create medical record', error });
    }
};

exports.getUserMedicals = async (req, res) => {
    try {
        const medicals = await Medical.find({ user: req.user.id });
        res.json(medicals);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch medical records', error });
    }
};

exports.updateMedical = async (req, res) => {
    const { title, dateTime, description } = req.body;

    // Validation for dateTime
    if (dateTime && !isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'DateTime must be a valid future date.' });
    }

    try {
        const medical = await Medical.findByIdAndUpdate(req.params.id, { title, dateTime, description }, { new: true });
        if (!medical) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.json(medical);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update medical record', error });
    }
};

exports.deleteMedical = async (req, res) => {
    try {
        const medical = await Medical.findByIdAndDelete(req.params.id);
        if (!medical) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.json({ message: 'Medical record deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete medical record', error });
    }
};
