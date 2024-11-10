const cron = require('node-cron');
const Event = require("../models/eventModel");


// Utility function to check if a date and time are in the past
const isDateTimeInPast = (date, time) => {
  const currentDateTime = new Date();
  const eventDateTime = new Date(`${date}T${time}`);
  return eventDateTime < currentDateTime;
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { name, date, time, location, totalGuests, note } = req.body;

    // Check if the event date and time are in the past
    if (isDateTimeInPast(date, time)) {
      return res.status(400).json({ message: "Cannot create an event in the past" });
    }

    // Create a new event and associate it with the authenticated user
    const newEvent = new Event({
      name,
      date,
      time,
      location,
      totalGuests,
      note,
      userId: req.user.id, // Use the authenticated user's ID
    });

    // Save the event
    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

// Get all events for the authenticated user
const getAllEvents = async (req, res) => {
  try {
    // Retrieve events that belong to the authenticated user
    const events = await Event.find({ userId: req.user.id }); // Only return events for the logged-in user
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve events", error: error.message });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    // Find the event by ID and ensure it belongs to the authenticated user
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user.id, // Check if the event belongs to the logged-in user
    });

    // Check if the event was found
    if (!event) {
      return res.status(404).json({ message: "Event not found or you do not have access to it" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve event", error: error.message });
  }
};


// Update an event
const updateEvent = async (req, res) => {
  try {
    const { name, date, time, location, totalGuests, note } = req.body;

    if (isDateTimeInPast(date, time)) {
      return res.status(400).json({ message: "Cannot update an event to a past date and time" });
    }

    // Find the event by ID and check if it belongs to the authenticated user
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id, // Ensure the event belongs to the authenticated user
      },
      { name, date, time, location, totalGuests, note },
      { new: true }
    );

    // Check if the event was found and updated
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found or you do not have access to it" });
    }

    res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Failed to update event", error: error.message });
  }
};


// Delete an event
const deleteEvent = async (req, res) => {
  try {
    // Find the event by ID and check if it belongs to the authenticated user
    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // Ensure the event belongs to the authenticated user
    });

    // Check if the event was found and deleted
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found or you do not have access to it" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};


// Function to check for upcoming events and send reminders
const checkUpcomingEvents = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const nextDay = new Date(tomorrow);
  nextDay.setHours(23, 59, 59, 999);

  try {
    // Fetch all events for each user
    const users = await User.find(); // Assuming you have a User model

    for (const user of users) {
      const events = await Event.find({
        userId: user._id, // Ensure you only get events for the current user
        date: {
          $gte: tomorrow,
          $lte: nextDay,
        },
      });

      for (const event of events) {
        await sendReminderEmail(user.email, event); // Send the reminder to the user's email
      }
    }
  } catch (error) {
    console.error("Failed to send reminders:", error.message);
  }
};

// Schedule the cron job to run every day at 9 AM
cron.schedule('40 20 * * *', () => {
  console.log("Checking for upcoming events...");
  checkUpcomingEvents();
});


module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
 
};
