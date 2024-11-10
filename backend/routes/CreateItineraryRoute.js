// routes/itineraryRoutes.js
const express = require('express');
const router = express.Router();
const { createItinerary, getAllItineraries, deleteItinerary } = require('../controllers/CreateItineraryCon');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);


router.post('/createItinerary', createItinerary);

router.get('/createItinerary', getAllItineraries);

router.delete('/createItinerary/:id', deleteItinerary);

module.exports = router;
