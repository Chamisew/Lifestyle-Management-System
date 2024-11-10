import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making API requests
import { useNavigate, useParams } from 'react-router-dom';

function UpdatePayment() {
  const { id } = useParams();
  const [payment, setPayment] = useState({
    amount: '',
    type: '',
    date: '',
    description: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // API URL for payments
  const API_URL = 'http://localhost:5000/api/payments';

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token from local storage
          }
        });
        const paymentToUpdate = response.data.find((p) => p._id === id);
        if (paymentToUpdate) {
          setPayment(paymentToUpdate);
        }
      } catch (error) {
        console.error('Failed to fetch payment:', error);
      }
    };

    fetchPayment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for amount
    if (name === 'amount') {
      if (value <= 0) {
        return;
      }
    }

    // Validation for type
    if (name === 'type') {
      const isValidType = /^[A-Za-z\s]*$/.test(value);
      if (!isValidType) {
        return;
      }
    }

    // Validation for date
    if (name === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        return;
      }
    }

    // Validation for description
    if (name === 'description') {
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
      setPayment({
        ...payment,
        [name]: filteredValue,
      });
      return;
    }

    setPayment({
      ...payment,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional validation before submission
    const selectedDate = new Date(payment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) { // Check if the date is in the past
      setSuccessMessage('Please select a future date.');
      return;
    }

    if (payment.amount <= 0) {
      setSuccessMessage('Amount must be greater than 0.');
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(payment.type)) {
      setSuccessMessage('Type must contain only letters and spaces.');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(payment.description)) {
      setSuccessMessage('Description must contain only letters and spaces.');
      return;
    }

    try {
      await axios.put(`${API_URL}/${id}`, payment, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token from local storage
        }
      });
      setSuccessMessage('Payment updated successfully!');
      setTimeout(() => {
        navigate('/paymentlist');
      }, 2000); // Redirect after 2 seconds to show success message
    } catch (error) {
      setSuccessMessage('Failed to update payment. Please try again.');
    }
  };

  return (
    <div className="updatecontainerbox">
      <h2>Update Payment</h2>
      <div className="updatecontainer">
        {successMessage && <p className="successMessage">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={payment.amount || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Type:</label>
            <input
              type="text"
              name="type"
              value={payment.type || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={payment.date ? payment.date.split('T')[0] : ''} // Adjust date format if necessary
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={payment.description || ''}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Update Payment</button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePayment;
