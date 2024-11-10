const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  Income: { 
    type: Number,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  incomedate: { 
    type: String,
    required: true,
  },
  user: { // Add user reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure you have a User model
    required: true,
  },
});

const Card = mongoose.model('IncomeCard', cardSchema);

module.exports = Card;
