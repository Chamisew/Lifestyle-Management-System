// controllers/reminderController.js
const Reminder = require('../models/eventMinderReminderModel');


// Create a new reminder
exports.createReminder = async (req, res) => {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Destructure the required fields from the request body
    const { wish, address, email, name, time, date, event } = req.body;

    // Check if all required fields are provided
    if (!wish || !address || !email || !name || !time || !date || !event) {
        return res.status(400).json({
            error: 'All fields are required: wish, address, email, name, time, date, event'
        });
    }

    try {
        // Create a new reminder with all required fields
        const newReminder = new Reminder({
            wish,
            address,
            email,
            name,
            time,
            date,
            event,
            user: req.user.id // Ensure the user ID is set correctly
        });

        await newReminder.save();
        res.status(201).json({ message: "Reminder created successfully", reminder: newReminder });
    } catch (error) {
        console.error("Error creating reminder:", error);
        if (error.name === 'ValidationError') {
            return res.status(422).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

// Get all reminders for the authenticated user or filter by date
exports.getAllReminders = async (req, res) => {
    try {
        const { date } = req.query; // Get the date from the query parameters
        let query = { user: req.user.id }; // Filter reminders for the authenticated user

        // If a date is provided, filter reminders based on the date
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1); // Set the end date to the next day
            
            query.date = { $gte: startDate, $lt: endDate }; // Include reminders for the given date
        }

        // Retrieve reminders from the database
        const reminders = await Reminder.find(query);
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Return error message
    }
};

// Get a single reminder by ID
exports.getReminderById = async (req, res) => {
    try {
        const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id }); // Find by ID and user ID
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }
        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a reminder by ID
exports.updateReminder = async (req, res) => {
    try {
        const { event, date, time, name, email, address, wish } = req.body; // Include time here

        // Validate event type
        const validEvents = ['Birthdays', 'Anniversaries', 'Memorial Dates', 'Other special events'];
        if (event && !validEvents.includes(event)) {
            return res.status(400).json({ 
                error: 'Invalid event type. Valid types are: Birthdays, Anniversaries, Memorial Dates, Other special events' 
            });
        }

        // Update the reminder based on ID and user ID
        const reminder = await Reminder.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, // Update using the correct field name 'user'
            { event, date, time, name, email, address, wish }, 
            { new: true, runValidators: true } // Added runValidators to validate the update
        );

        // Check if the reminder was found and updated
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        // Send the updated reminder in response
        res.status(200).json(reminder);
    } catch (error) {
        // Handle errors and send error response
        res.status(500).json({ error: error.message });
    }
};

// Delete a reminder by ID
exports.deleteReminder = async (req, res) => {
    try {
        // Find and delete the reminder by ID and user ID
        const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        // Check if the reminder was found and deleted
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        // Send success response
        res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        // Handle errors and send error response
        res.status(500).json({ error: error.message });
    }
};

// Get reminders by specific date for birthdays
exports.getRemindersByDateBirthday = async (req, res) => {
    try {
        const { date } = req.query;

        // Check if the date query parameter is provided
        if (!date) {
            return res.status(400).json({ error: 'Date query parameter is required' });
        }

        // Parse start and end dates for the specified day
        const startDate = new Date(date + 'T00:00:00Z'); // Start of the day in UTC
        const endDate = new Date(date + 'T23:59:59Z');   // End of the day in UTC

        // Validate that the dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Fetch reminders for the specified date, event type, and user ID
        const reminders = await Reminder.find({
            date: { $gte: startDate, $lte: endDate },
            event: 'Birthdays',
            user: req.user.id // Updated to use 'user' instead of 'userId'
        });

        // Send the reminders in the response
        res.status(200).json(reminders);
    } catch (error) {
        console.error("Error fetching reminders by date:", error);
        res.status(500).json({ error: 'An error occurred while fetching reminders' });
    }
};

// Get reminders by specific date for anniversaries
exports.getRemindersByDateAnniversaries = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date query parameter is required' });
        }

        const startDate = new Date(date + 'T00:00:00Z'); // Start of the day in UTC
        const endDate = new Date(date + 'T23:59:59Z');   // End of the day in UTC

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const reminders = await Reminder.find({
            date: { $gte: startDate, $lte: endDate },
            event: 'Anniversaries',
            user: req.user.id // Filter by user ID
        });

        res.status(200).json(reminders);
    } catch (error) {
        console.error("Error fetching reminders by date:", error);
        res.status(500).json({ error: 'An error occurred while fetching reminders' });
    }
};

// Get reminders by specific date for memorial days
exports.getRemindersByDateMemorialDays = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date query parameter is required' });
        }

        const startDate = new Date(date + 'T00:00:00Z'); // Start of the day in UTC
        const endDate = new Date(date + 'T23:59:59Z');   // End of the day in UTC

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const reminders = await Reminder.find({
            date: { $gte: startDate, $lte: endDate },
            event: 'Memorial Dates',
            user: req.user.id // Filter by user ID
        });

        res.status(200).json(reminders);
    } catch (error) {
        console.error("Error fetching reminders by date:", error);
        res.status(500).json({ error: 'An error occurred while fetching reminders' });
    }
};

// Get reminders by specific date for Other Special Days
exports.getRemindersByDateOtherSpecialDays = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date query parameter is required' });
        }z

        const startDate = new Date(date + 'T00:00:00Z'); // Start of the day in UTC
        const endDate = new Date(date + 'T23:59:59Z');   // End of the day in UTC

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const reminders = await Reminder.find({
            date: { $gte: startDate, $lte: endDate },
            event: 'Other special events',
            user: req.user.id // Filter by user ID
        });

        res.status(200).json(reminders);
    } catch (error) {
        console.error("Error fetching reminders by date:", error);
        res.status(500).json({ error: 'An error occurred while fetching reminders' });
    }
};
