// controllers/CreateItineraryCon.js
const Itinerary = require('../models/CreateItineraryModel');
const Event = require('../models/eventModel');

// Create a new itinerary
const createItinerary = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated user

        const itinerary = new Itinerary({
            name: req.body.name,
            eventId: req.body.eventId,
            userId: userId // Assign userId from the request
        });

        const savedItinerary = await itinerary.save();
        res.status(201).json(savedItinerary);
    } catch (error) {
        console.error('Error creating itinerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all itineraries for the authenticated user
const getAllItineraries = async (req, res) => {
    const userId = req.user.id; // Get the user ID from the authenticated request

    try {
        const itineraries = await Itinerary.find({ userId }).populate('eventId');
        res.status(200).json(itineraries);
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an itinerary
const deleteItinerary = async (req, res) => {
    const userId = req.user.id; // Get the user ID from the authenticated request

    try {
        const { id } = req.params;
        const result = await Itinerary.deleteOne({ _id: id, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Itinerary not found or you are not authorized to delete it' });
        }

        res.status(200).json({ message: 'Itinerary deleted' });
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createItinerary,
    getAllItineraries,
    deleteItinerary,
};
