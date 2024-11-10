const express = require('express');
const {
  createBudget,
  getBudgets,
  getTotalPayment,
  getMonthlyIncome,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(authenticateToken);
// Budget routes
router.post('/', createBudget); // Create a new budget
router.get('/', getBudgets); // Get all budgets
router.get('/total', getTotalPayment); // Get total payment
router.get('/monthly-income', getMonthlyIncome); // Ensure this is defined
router.put('/:id', updateBudget); // Update a budget by ID
router.delete('/:id', deleteBudget); // Delete a budget by ID

module.exports = router;
