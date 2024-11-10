const Saving = require("../models/savingModel");

exports.addSaving = async (req, res) => {
  console.log('Authenticated User:', req.user); // Log user details
  try {
    const { amount, targetDate, amountLeft, description } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newSaving = new Saving({
      userId: req.user.id, // Use req.user.id instead of req.user._id
      amount,
      targetDate,
      amountLeft,
      description,
      photo: req.file ? `/uploads/${req.file.filename}` : null, // Include photo if it exists
    });

    await newSaving.save();
    res.json(newSaving);
  } catch (error) {
    res.status(500).json({ message: "Error adding saving entry", error });
  }
};


// Get all savings for the authenticated user
exports.getSavings = async (req, res) => {
  try {
    // Filter savings by userId
    const savings = await Saving.find({ userId: req.user.id }); // Ensure this matches the field in your schema
    res.json(savings);
  } catch (error) {
    console.error("Error fetching savings:", error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching savings", error });
  }
};


// Edit an existing saving
exports.editSaving = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  try {
    const { amount, targetDate, amountLeft, description } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    // Find and update the saving only if it belongs to the logged-in user
    const updatedSaving = await Saving.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Ensure the user owns the saving
      {
        amount,
        targetDate,
        amountLeft,
        description,
        photo,
      },
      { new: true } // Return the updated document
    );

    if (!updatedSaving) {
      return res.status(404).json({ message: "Saving not found or not authorized" });
    }

    res.json(updatedSaving);
  } catch (error) {
    console.error("Error updating saving:", error); // Log the error for debugging
    res.status(500).json({ message: "Error updating saving entry", error });
  }
};


// Delete a saving
exports.deleteSaving = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters
    
    // Ensure the user owns the saving before attempting to delete
    const deletedSaving = await Saving.findOneAndDelete({ _id: id, userId: req.user.id }); 

    if (!deletedSaving) {
      return res.status(404).json({ message: "Saving entry not found or not authorized" });
    }

    res.status(200).json({ message: "Saving deleted successfully" });
  } catch (error) {
    console.error("Error deleting saving:", error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting saving", error });
  }
};

