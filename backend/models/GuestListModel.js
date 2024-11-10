// models/GuestList.js
const mongoose = require('mongoose');

const guestListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  phone: { type: String },
  email: { type: String },
  invitationStatus: {
    type: String,
    enum: ['pending', 'denied', 'accepted'],
    default: 'pending'
  },
  invitationSent: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Adding user reference
});

const GuestList = mongoose.model('GuestList', guestListSchema);
module.exports = GuestList;
