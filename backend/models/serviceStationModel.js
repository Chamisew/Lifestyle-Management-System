const mongoose = require('mongoose');

const serviceStationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
});

module.exports = mongoose.model('ServiceStation', serviceStationSchema);
