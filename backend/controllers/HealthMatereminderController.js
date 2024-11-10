const Reminder = require('../models/HealthMatereminder');

exports.addReminder = async (req, res) => {
    const { reminderType, description, days, time } = req.body;
    const newReminder = new Reminder({ reminderType, description, days, time });
    try {
        const savedReminder = await newReminder.save();
        res.status(201).json(savedReminder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add reminder' });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find();
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
};



exports.updateReminder = async (req, res) => {
    const { id } = req.params;
    const { reminderType, description, days, time } = req.body;

    try {
        const updatedReminder = await Reminder.findByIdAndUpdate(
            id,
            { reminderType, description, days, time },
            { new: true, runValidators: true }
        );

        if (!updatedReminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        res.status(200).json(updatedReminder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update reminder' });
    }
};

exports.getReminderById = async (req, res) => {
    const { id } = req.params;

    try {
        const reminder = await Reminder.findById(id);

        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reminder' });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        await Reminder.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
};
