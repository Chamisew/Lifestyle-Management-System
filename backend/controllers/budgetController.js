const Budget = require('../models/budgetModel');
const mongoose = require('mongoose');
// Create a new budget
// Create a new budget
const createBudget = async (req, res) => {
  const { paymentType, amount, date } = req.body;
  const user = req.user.id; // Assuming you're using some auth middleware to get the user

  if (!paymentType || !amount || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const budget = new Budget({ paymentType, amount, date, user });
    const savedBudget = await budget.save();
    return res.status(201).json(savedBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return res.status(400).json({ message: error.message });
  }
};


// Get all budgets
const getBudgets = async (req, res) => {
  const user = req.user.id; // The user is retrieved from the token
  try {
    const budgets = await Budget.find({ user }).populate('user', 'name email');
    res.status(200).json(budgets);
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get total payment



const getTotalPayment = async (req, res) => {
  try {
      const userId = req.user.id; // Authenticated user's ID
    

      // Check for budgets for the user
      const budgets = await Budget.find({ user: userId });
      

      // If no budgets found, return 0
      if (budgets.length === 0) {
          return res.status(200).json({ total: 0, message: "No budgets found for this user." });
      }

      // Calculate total payment amount for the user
      const totalPayment = await Budget.aggregate([
          {
              $match: { user: new mongoose.Types.ObjectId(userId) }, // Use 'new' to create ObjectId
          },
          {
              $group: {
                  _id: null,
                  total: { $sum: '$amount' },
              },
          },
      ]);

    
      // Return the total amount, default to 0 if no data exists
      const totalAmount = totalPayment[0]?.total || 0;
      res.status(200).json({ total: totalAmount });

  } catch (error) {
      console.error("Error in getTotalPayment:", error);
      res.status(400).json({ message: error.message });
  }
};

// Update a budget
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentType, amount, date } = req.body;

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Ensure the budget belongs to the user
      { paymentType, amount, date },
      { new: true, runValidators: true } // Return updated document & run validation
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found or you don't have permission to update it" });
    }

    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBudget = await Budget.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure the budget belongs to the user

    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found or you don't have permission to delete it" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMonthlyIncome = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID
    const currentYear = new Date().getFullYear();

   
    // Check if there are any budgets for the user
    const budgets = await Budget.find({ user: userId });
   

    // Check if budgets exist
    if (budgets.length === 0) {
      return res.status(200).json({ message: "No budgets found for this user." });
    }

    const monthlyIncome = await Budget.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
          user: new mongoose.Types.ObjectId(userId), // Make sure user is ObjectId
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

   

    const response = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyIncome.find((m) => m._id === i + 1);
      return {
        month: i + 1,
        total: monthData ? monthData.total : 0,
      };
    });

   

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching monthly income:", error);
    res.status(400).json({ message: error.message });
  }
};



module.exports = {
  createBudget,
  getBudgets,
  getTotalPayment,
  getMonthlyIncome,
  updateBudget,
  deleteBudget,
  
};
