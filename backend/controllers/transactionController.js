const Transaction = require('../models/transactionModel');
const path = require('path');
const mongoose = require('mongoose');

// Controller function to add a transaction
const addTransaction = async (req, res) => {
  const { name, amount, date } = req.body;
  const image = req.file ? req.file.filename : null; // Get the filename from req.file

  // Debug log to see what req.user contains
  console.log('User in request:', req.user);

  // Check if user ID exists in the request user object
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User ID is missing." });
  }

  try {
    const newTransaction = new Transaction({
      name,
      amount,
      date,
      userId: req.user.id,
      image, // Save the image filename
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: "Error adding transaction", error });
  }
};


// Controller function to get all transactions
// Controller function to get all transactions
const getTransactions = async (req, res) => {
  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    // Normalize the image paths to serve correctly
    const formattedTransactions = transactions.map(transaction => {
      return {
        ...transaction._doc,
        image: transaction.image ? `http://localhost:5000/uploads/${transaction.image}` : null // Prepend the uploads URL to the image path
      };
    });

    res.status(200).json(formattedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};


// Controller function to delete a transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params; // Get the transaction ID from the request parameters

  // Validate ObjectId
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }

  try {
    const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, userId: req.user.id }); // Ensure the user owns the transaction

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found or not owned by user" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Error deleting transaction", error: error.message });
  }
};


module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction,
};
