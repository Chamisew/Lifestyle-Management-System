const Reminder = require('../models/reminderModel');

exports.createReminder = async (req, res) => {
    try {
        // Ensure that email is included in the reminder data
        const { vehicleName, reminderType, date, appointedTime, location, cost, notes, email } = req.body;

        const reminder = new Reminder({
            vehicleName,
            reminderType,
            date,
            appointedTime,
            location,
            cost,
            notes,
            email // Include email here
        });

        await reminder.save();
        res.status(201).json(reminder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find().populate('vehicleName');
        res.status(200).json(reminders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateReminder = async (req, res) => {
    try {
        // Include email in the update operation
        const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.status(200).json(reminder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findByIdAndDelete(req.params.id);

        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
