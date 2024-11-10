const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    reminderType: { type: String, required: true },
    description: { type: String, required: true },
    days: { type: String, required: true },
    time: { type: String, required: true }
   
});

module.exports = mongoose.model('HealthMatereminder', reminderSchema);
