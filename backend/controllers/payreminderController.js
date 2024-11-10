const Reminder = require('../models/payReminder');

// Get all reminders for the authenticated user
exports.getAllReminders = async (req, res) => {
  const user = req.user.id;

  try {
    const reminders = await Reminder.find({ user }).populate('user', 'name email');
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reminder by ID for the authenticated user
exports.getReminderById = async (req, res) => {
  const user = req.user.id;

  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found or unauthorized' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new reminder
exports.createReminder = async (req, res) => {
  const { date, amount, description, phonenumber } = req.body;
  const user = req.user.id;

  const reminder = new Reminder({
    date,
    amount,
    description,
    phonenumber,
    user,
  });

  try {
    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a reminder by ID for the authenticated user
exports.updateReminder = async (req, res) => {
  const user = req.user.id;
  const { date, amount, description, phonenumber } = req.body;

  try {
    // Find the reminder and update it
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user },
      { date, amount, description, phonenumber },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found or unauthorized' });
    }

    res.json(reminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Delete a reminder by ID for the authenticated user
exports.deleteReminder = async (req, res) => {
  const user = req.user.id;

  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user });

    if (!reminder) return res.status(404).json({ message: 'Reminder not found or unauthorized' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
