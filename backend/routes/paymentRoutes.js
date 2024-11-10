const express = require('express');
const { createPayment, getAllPayments,  updatePayment,  deletePayment, getTotalPayments, getPaymentStats} = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticateToken);

router.post('/', createPayment);

router.get('/', getAllPayments);


router.put('/:id', updatePayment);

router.delete('/:id', deletePayment);

router.get('/total-payments', getTotalPayments);

router.get('/payment-stats', getPaymentStats);


module.exports = router;



