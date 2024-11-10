const express = require('express');
const { getAllReminders, getReminderById, createReminder, updateReminder, deleteReminder } = require('../controllers/payreminderController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllReminders);
router.get('/:id', getReminderById);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
