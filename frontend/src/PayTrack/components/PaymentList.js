import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making API requests
import { Link, useNavigate } from 'react-router-dom';

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0); // State to store total payments
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // API URL for payments
  const API_URL = 'http://localhost:5000/api/payments';

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token from local storage
          }
        });
        const paymentData = response.data;
        setPayments(paymentData);
        
        // Calculate total payments
        const total = paymentData.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalPayments(total);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/update-payment/${id}`);  // Navigate to the update page with the payment ID
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token from local storage
        }
      });
      setSuccessMessage('Payment deleted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        const updatedPayments = payments.filter(payment => payment._id !== id);
        setPayments(updatedPayments);

        // Recalculate total payments
        const total = updatedPayments.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalPayments(total);
      }, 2000);  // Display success message and then remove the payment from the list
    } catch (error) {
      setSuccessMessage('Failed to delete payment. Please try again.');
    }
  };

  return (
    <div className="payListcontainer">
      <h2>Payment List</h2>
      {successMessage && (
        <p className={successMessage.includes('successfully') ? '' : 'errorMessage'}>
          {successMessage}
        </p>
      )}
      <div className="total-payments">
        <h3>Total Payments</h3>
        <h3>LKR {totalPayments.toLocaleString()}</h3>
      </div>
      <ul>
        {payments.map((payment) => (
          <li key={payment._id}>
            {payment.amount} - {payment.type} - {new Date(payment.date).toLocaleDateString()} - {payment.description}
            <div>
              <button onClick={() => handleUpdate(payment._id)}>Update</button>
              <button className="delete" onClick={() => handleDelete(payment._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/payments" className="Link">Add Payment</Link> <br />
      <Link to="/add-payreminder" className="Link">Add Reminder</Link> <br />
      <Link to="/add-card" className="Link">Add Card</Link>  
    </div>
  );
}

export default PaymentList;
