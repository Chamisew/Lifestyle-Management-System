const express = require('express');
const {getAllCards, getCardById, createCard, updateCard,  deleteCard} = require('../controllers/cardController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllCards);
router.get('/:id', getCardById);
router.post('/', createCard);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

module.exports = router;
