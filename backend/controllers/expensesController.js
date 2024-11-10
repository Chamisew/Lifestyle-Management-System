const Expense = require('../models/ExpensesModel');

// Create a new expense and associate it with the authenticated user
const createExpense = async (req, res) => {
  try {
    const { budgetName, expenses } = req.body;
    const userId = req.user.id; // Get the authenticated user's ID

    const newExpense = new Expense({
      budgetName,
      expenses,
      userId // Associate the expense with the user
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error });
  }
};

// Retrieve expenses by budget name for the authenticated user
const getExpensesByBudgetName = async (req, res) => {
  try {
    const { budgetName } = req.params;
    const userId = req.user.id; // Get the authenticated user's ID

    const expenses = await Expense.findOne({ budgetName, userId }); // Filter by userId
    if (expenses) {
      res.json(expenses);
    } else {
      res.status(404).json({ message: 'Expenses not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving expenses', error });
  }
};

// Retrieve all expenses for the authenticated user
const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID

    const expenses = await Expense.find({ userId }); // Filter by userId
    if (expenses.length > 0) {
      res.json(expenses);
    } else {
      res.status(404).json({ message: 'No expenses found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving expenses', error });
  }
};

// Update an expense associated with the authenticated user
const updateExpense = async (req, res) => {
  try {
    const { budgetName, index } = req.params;
    const { name, amount } = req.body;
    const userId = req.user.id; // Get the authenticated user's ID

    const expenseDoc = await Expense.findOne({ budgetName, userId }); // Filter by userId
    if (expenseDoc) {
      expenseDoc.expenses[index] = { name, amount };
      await expenseDoc.save();
      res.json(expenseDoc);
    } else {
      res.status(404).json({ message: 'Expenses not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
};

// Delete an expense associated with the authenticated user
const deleteExpense = async (req, res) => {
  try {
    const { budgetName, index } = req.params;
    const userId = req.user.id; // Get the authenticated user's ID

    const expenseDoc = await Expense.findOne({ budgetName, userId }); // Filter by userId
    if (expenseDoc) {
      expenseDoc.expenses.splice(index, 1);
      await expenseDoc.save();
      res.json(expenseDoc);
    } else {
      res.status(404).json({ message: 'Expenses not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
};

// Delete an expense by ID
const deleteExpenseById = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.user.id; // Get the authenticated user's ID

    const result = await Expense.findOneAndDelete({ _id: expenseId, userId }); // Filter by userId

    if (!result) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createExpense,
  getExpensesByBudgetName,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  deleteExpenseById,
};
