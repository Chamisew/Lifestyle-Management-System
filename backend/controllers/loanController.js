const Loan = require('../models/loanModel');


// Create a new loan
exports.createLoan = async (req, res) => {
    const { totalAmount, amountPaid } = req.body;
    const userId = req.user.id; // Assuming you have user info in req.user

    try {
        const newLoan = new Loan({ totalAmount, amountPaid, user: userId });
        await newLoan.save();
        res.status(201).json(newLoan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all loans for a user
exports.getUserLoans = async (req, res) => {
    const userId = req.user.id;

    try {
        const loans = await Loan.find({ user: userId });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a loan
exports.updateLoan = async (req, res) => {
    const { id } = req.params;
    const { totalAmount, amountPaid } = req.body;

    try {
        const updatedLoan = await Loan.findByIdAndUpdate(
            id,
            { totalAmount, amountPaid },
            { new: true }
        );
        res.json(updatedLoan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a loan
exports.deleteLoan = async (req, res) => {
    const { id } = req.params;

    try {
        await Loan.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLoanSummary = async (req, res) => {
  try {
    // Log user information to verify the user ID
    console.log("User from req:", req.user); // Should show { id: 'user_id', iat, exp }

    // Use req.user.id for filtering loans by user ID
    const loans = await Loan.find({ user: req.user.id });

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: "No loans found for this user" });
    }

    // Calculate total loan, total paid, and amount left
    const totalLoan = loans.reduce((acc, loan) => acc + loan.totalAmount, 0);
    const totalPaid = loans.reduce((acc, loan) => acc + loan.amountPaid, 0);
    const amountLeft = totalLoan - totalPaid;

    res.status(200).json({ totalLoan, totalPaid, amountLeft });
  } catch (error) {
    console.error("Error fetching loan summary:", error);
    res.status(500).json({ message: "Failed to fetch loan summary", error: error.message });
  }
};
