const Activity = require('../models/activityModel');
const Itinerary = require('../models/CreateItineraryModel');

// Function to check if the date and time are in the past
const isDateTimeInPast = (date, time) => {
  const currentDateTime = new Date();
  const activityDateTime = new Date(`${date}T${time}`);
  return activityDateTime < currentDateTime;
};

// Create a new activity
const createActivity = async (req, res) => {
  const { name, date, time, itineraryId } = req.body;
  const userId = req.user.id; // Assuming your middleware sets req.user with the authenticated user

  try {
    // Check for missing fields
    if (!name || !date || !time || !itineraryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the activity date and time are in the past
    if (isDateTimeInPast(date, time)) {
      return res.status(400).json({ message: "Cannot create an activity with a past date and time" });
    }

    // Check if the itinerary exists
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Create the new activity
    const newActivity = new Activity({
      name,
      date,
      time,
      itineraryId,
      userId, // Include userId
    });

    // Save the activity
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all activities for the authenticated user
const getAllActivities = async (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID

  try {
    const activities = await Activity.find({ userId }); // Fetch activities specific to the user
    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an activity
const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { name, date, time, itineraryId } = req.body;
  const userId = req.user.id; // Get the authenticated user's ID

  try {
    // Check for missing fields
    if (!name || !date || !time || !itineraryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the updated activity date and time are in the past
    if (isDateTimeInPast(date, time)) {
      return res.status(400).json({ message: "Cannot update an activity to a past date and time" });
    }

    // Check if the itinerary exists
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Update the activity
    const updatedActivity = await Activity.findOneAndUpdate(
      { _id: id, userId }, // Ensure the activity belongs to the authenticated user
      { name, date, time, itineraryId },
      { new: true } // Return the updated document
    );

    // Check if the activity was found and updated
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found or not owned by user' });
    }

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an activity
const deleteActivity = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get the authenticated user's ID

  try {
    const result = await Activity.findOneAndDelete({ _id: id, userId }); // Ensure the activity belongs to the authenticated user
    if (!result) {
      return res.status(404).json({ message: 'Activity not found or not owned by user' });
    }
    res.status(200).json({ message: 'Activity deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
  updateActivity,
  deleteActivity,
};
