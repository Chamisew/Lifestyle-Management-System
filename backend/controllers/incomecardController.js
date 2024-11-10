const Card = require('../models/incomeCard');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import the authentication middleware

// Add a new card (now representing income)
const addCard = async (req, res) => {
  try {
    const { Income, cardNumber, incomedate } = req.body; // Updated field names
    const newCard = new Card({
      Income,
      cardNumber,
      incomedate,
      user: req.user.id, // Associate the card with the authenticated user
    });
    await newCard.save();
    return res.status(201).json({ message: 'Income card added successfully', card: newCard });
  } catch (error) {
    console.error('Error adding card:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get all cards (only for the authenticated user)
const getAllCards = async (req, res) => {
  try {
    // Find cards associated with the authenticated user
    const cards = await Card.find({ user: req.user.id });
    return res.status(200).json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Edit a card (now representing income)
const editCard = async (req, res) => {
  try {
    const { id } = req.params; // Get card ID from request parameters
    const { Income, cardNumber, incomedate } = req.body; // Updated field names

    // Find the card by ID and ensure it belongs to the authenticated user
    const updatedCard = await Card.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Ensure the user owns the card
      { Income, cardNumber, incomedate },
      { new: true } // Return the updated document
    );

    // Check if the card was found and updated
    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found or does not belong to you' });
    }

    return res.status(200).json({ message: 'Income card updated successfully', card: updatedCard });
  } catch (error) {
    console.error('Error updating card:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a card
const deleteCard = async (req, res) => {
  try {
    const { id } = req.params; // Get card ID from request parameters

    // Find the card by ID and ensure it belongs to the authenticated user
    const deletedCard = await Card.findOneAndDelete({ _id: id, user: req.user.id });

    // Check if the card was found and deleted
    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found or does not belong to you' });
    }

    return res.status(200).json({ message: 'Income card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  addCard,
  getAllCards,
  editCard,
  deleteCard,
};
