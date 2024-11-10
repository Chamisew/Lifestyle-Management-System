const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    vehicleName: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    reminderType: { type: String, required: true },
    date: { type: Date, required: true },
    appointedTime: { type: String, required: true }, // or Date if you prefer
    location: { type: String, required: true },
    cost: { type: Number, required: true },
    notes: { type: String },
    email: { type: String, required: true, match: /.+\@.+\..+/ }, // Basic email validation
}, { timestamps: true });

module.exports = mongoose.model('Remindervehicle', reminderSchema);
