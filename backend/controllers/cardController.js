const Card = require('../models/Card');

// Utility function to validate phone number
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10,15}$/; // Adjust regex as needed
  return phoneRegex.test(phoneNumber);
};

// Utility function to validate date
const isValidDate = (date) => {
  return !isNaN(new Date(date).getTime()) && new Date(date) > new Date();
};

// Get all cards for the authenticated user
exports.getAllCards = async (req, res) => {
  const userId = req.user.id;

  try {
    const cards = await Card.find({ user: userId });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a card by ID for the authenticated user
exports.getCardById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const card = await Card.findOne({ _id: id, user: userId });
    if (!card) {
      return res.status(404).json({ message: 'Card not found or unauthorized' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new card for the authenticated user
exports.createCard = async (req, res) => {
  const { reminderDate, expireDate, phoneNumber } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!isValidDate(reminderDate) || !isValidDate(expireDate)) {
    return res.status(400).json({ message: 'Invalid reminder or expiration date.' });
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

  try {
    const card = new Card({ reminderDate, expireDate, phoneNumber, user: userId });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a card for the authenticated user
exports.updateCard = async (req, res) => {
  const { id } = req.params;
  const { reminderDate, expireDate, phoneNumber } = req.body;
  const userId = req.user.id;

  // Validate input
  if (reminderDate && !isValidDate(reminderDate)) {
    return res.status(400).json({ message: 'Invalid reminder date.' });
  }

  if (expireDate && !isValidDate(expireDate)) {
    return res.status(400).json({ message: 'Invalid expiration date.' });
  }

  if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

  try {
    const card = await Card.findOneAndUpdate(
      { _id: id, user: userId },
      { reminderDate, expireDate, phoneNumber },
      { new: true, runValidators: true }
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found or unauthorized' });
    }
    res.json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a card for the authenticated user
exports.deleteCard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const card = await Card.findOneAndDelete({ _id: id, user: userId });
    if (!card) {
      return res.status(404).json({ message: 'Card not found or unauthorized' });
    }
    res.json({ message: 'Card deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
