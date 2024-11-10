const Payment = require('../models/Payment');

// Create a new payment
const createPayment = async (req, res) => {
  const { amount, type, date, description } = req.body;
  const user = req.user.id; // Get the user ID from the JWT payload

  try {
    const payment = new Payment({
      amount,
      type,
      date,
      description,
      user,  // Attach the user ID from the JWT token
    });

    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all payments for the authenticated user
const getAllPayments = async (req, res) => {
  const user = req.user.id; // Get the user ID from the JWT payload

  try {
    const payments = await Payment.find({ user }).populate('user', 'name email');
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: error.message });
  }
};


// Update a payment
const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, type, date, description } = req.body;
  const user = req.user.id; // Get the user ID from the JWT payload

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: id, user }, // Ensure the payment belongs to the user
      { amount, type, date, description },
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found or unauthorized' });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a payment
const deletePayment = async (req, res) => {
  const { id } = req.params;
  const user = req.user.id; // Get the user ID from the JWT payload

  try {
    const deletedPayment = await Payment.findOneAndDelete({ _id: id, user }); // Ensure the payment belongs to the user

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found or unauthorized' });
    }

    res.status(200).json({ message: 'Payment deleted' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: error.message });
  }
};



const getTotalPayments = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT payload
    const payments = await Payment.find({ user: userId });

    // Calculate total payments
    const totalPayments = payments.reduce((acc, payment) => acc + payment.amount, 0);

    res.json({ totalPayments });
  } catch (error) {
    console.error('Error fetching total payments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getPaymentStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const payments = await Payment.find({ user: userId });

    // Aggregate payments by month
    const stats = payments.reduce((acc, payment) => {
      const month = new Date(payment.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += payment.amount;
      return acc;
    }, {});

    res.json(stats);
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  updatePayment,
  deletePayment,
  getTotalPayments,
  getPaymentStats,
};
