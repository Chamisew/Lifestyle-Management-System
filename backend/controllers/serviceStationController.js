const ServiceStation = require('../models/serviceStationModel');

exports.createServiceStation = async (req, res) => {
    try {
        const serviceStation = new ServiceStation(req.body);
        await serviceStation.save();
        res.status(201).json(serviceStation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getServiceStations = async (req, res) => {
    try {
        const serviceStations = await ServiceStation.find();
        res.status(200).json(serviceStations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateServiceStation = async (req, res) => {
    try {
        const serviceStation = await ServiceStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(serviceStation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteServiceStation = async (req, res) => {
    try {
        await ServiceStation.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
