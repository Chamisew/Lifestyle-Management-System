const express = require('express');
const { 
  createLoan,
  getUserLoans,
  updateLoan,
  deleteLoan,
  getLoanSummary
} = require('../controllers/loanController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Define routes
router.post('/', createLoan); // Create loan
router.get('/', getUserLoans); // Get user loans
router.get('/summary', getLoanSummary); // Get loan summary
router.put('/:id', updateLoan); // Update loan
router.delete('/:id', deleteLoan); // Delete loan

module.exports = router;
