const express = require('express');
const router = express.Router();
const {
  createGuest,
  getAllGuests,
  getGuestById,
  updateGuest,
  deleteGuest
} = require('../controllers/guestListController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.post('/guests', createGuest);
router.get('/guests', getAllGuests);
router.get('/guests/:id',getGuestById);
router.put('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

module.exports = router;
