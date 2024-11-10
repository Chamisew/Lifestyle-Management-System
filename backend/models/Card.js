const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  reminderDate: {
    type: Date,
    required: true,
  },
  expireDate: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Ensure that each card is associated with a user
  },
});

module.exports = mongoose.model('Card', cardSchema);
