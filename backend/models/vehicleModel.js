const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    makeYear: { type: Number, required: true },
    lastServiceDate: { type: Date, required: true },
    licenseExpirationDate: { type: Date, required: true },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
