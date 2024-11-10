// controllers/GuestListController.js
const GuestList = require('../models/GuestListModel');

// Validate name, phone number, and email
const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validateEmail = (email) => /^[a-zA-Z0-9\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// Create a new guest
const createGuest = async (req, res) => {
  try {
    const { name, phone, email, eventId } = req.body;

    // Validate input
    if (!validateName(name)) {
      return res.status(400).json({ message: 'Invalid name.' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ message: 'Invalid phone number.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Create a new guest and set the user from the authenticated user
    const guest = new GuestList({
      name,
      phone,
      email,
      eventId,
      user: req.user.id // Use user ID from the authenticated token
    });

    await guest.save();
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all guests for the authenticated user
const getAllGuests = async (req, res) => {
  try {
    const guests = await GuestList.find({ user: req.user.id }).populate('eventId', 'name'); 
    res.status(200).json(guests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get guest by ID for the authenticated user
const getGuestById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Guest ID is required' });
    }

    const guest = await GuestList.findOne({ _id: id, user: req.user.id }); // Ensure guest belongs to the user
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    res.status(200).json(guest);
  } catch (error) {
    console.error('Error fetching guest:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// Update guest details for the authenticated user
const updateGuest = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // Validate input
    if (name && !validateName(name)) {
      return res.status(400).json({ message: 'Invalid name.' });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ message: 'Invalid phone number.' });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    const guest = await GuestList.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure guest belongs to the user
      req.body,
      { new: true }
    );

    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.status(200).json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a guest for the authenticated user
const deleteGuest = async (req, res) => {
  try {
    const guest = await GuestList.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Ensure guest belongs to the user
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Export all functions
module.exports = {
  createGuest,
  getAllGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
};
