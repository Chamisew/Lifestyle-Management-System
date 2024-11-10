const Goal = require("../models/goalModel");


const createGoal = async (req, res) => {
    const { title, due_date, amount } = req.body;

    const newGoal = new Goal({
        title,
        due_date,
        amount,
        user: req.user.id, // Ensure you are using req.user.id
    });

    try {
        await newGoal.save();
        res.status(201).json(newGoal);
    } catch (error) {
        console.error("Error details:", error);
        res.status(400).json({ message: "Error creating goal" });
    }
};


// Get all goals for the authenticated user
// Get goals for the authenticated user
const getGoals = async (req, res) => {
  try {
    // Find goals for the authenticated user based on their user ID
    const goals = await Goal.find({ user: req.user.id }).populate('user', 'username'); // Populate user info if needed
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Error fetching goals" });
  }
};

// Update a goal
const updateGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Ensure the goal belongs to the authenticated user
      req.body,
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found or not authorized" });
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error); // Log the error for debugging
    res.status(400).json({ message: "Error updating goal" });
  }
};

// Delete a goal
const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGoal = await Goal.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure the goal belongs to the authenticated user

    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found or not authorized" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting goal" });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
