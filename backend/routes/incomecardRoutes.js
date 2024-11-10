const express = require('express');
const {
    addCard,
    getAllCards,
    editCard,
    deleteCard,
 
} = require('../controllers/incomecardController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(authenticateToken);

// Add routes for cards
router.post('/cards', addCard); // Add card
router.get('/cards', getAllCards); // Get all cards
router.put('/cards/:id', editCard); // Edit card
router.delete('/cards/:id', deleteCard); // Delete card

module.exports = router;
