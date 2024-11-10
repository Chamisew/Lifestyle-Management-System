import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function PaymentForm() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/payments';

  const paymentTypes = [
    'Construction', 'Education services', 'Employee compensation',
    'Exports (of goods)', 'Financial services', 'Gifts and donations',
    'Hardware consultancy', 'Health services', 'Insurance and pension services',
    'Intellectual property', 'Investment banking', 'Manufacturing - goods',
    'Other business services', 'Other insurance', 'Recreational services',
    'Tax', 'Telecommunication, computer', 'Travel', 'Family support',
    'Donations', 'Educational support'
  ];

  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    const isValidDescription = /^[A-Za-z\s]*$/.test(value);
    if (isValidDescription) {
      setDescription(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !type || !date || !description) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setErrorMessage('Please select a future date.');
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(description)) {
      setErrorMessage('Description must contain only letters and spaces.');
      return;
    }

    const newPayment = { amount, type, date, description };

    try {
      await axios.post(API_URL, newPayment, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      Swal.fire({
        title: 'Success!',
        text: 'Payment added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Reset form fields
      setAmount('');
      setType('');
      setDate('');
      setDescription('');
      setErrorMessage('');
      setSuccessMessage('Payment added successfully!');

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add payment. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const handleShowPayments = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setPayments(response.data);

      Swal.fire({
        title: 'Payment List',
        html: `
          <div style="max-height: 400px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse; margin: 0 auto; font-size: 14px;">
              <thead>
                <tr style="background-color: #f2f2f2; text-align: left;">
                  <th style="padding: 8px;">Amount</th>
                  <th style="padding: 8px;">Type</th>
                  <th style="padding: 8px;">Date</th>
                  <th style="padding: 8px;">Description</th>
                  <th style="padding: 8px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${response.data.map(payment => `
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payment.amount}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payment.type}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(payment.date).toLocaleDateString()}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payment.description}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;" class="table-actions">
                      <button class="update-btn" data-id="${payment._id}" style="margin-right: 10px; background-color: #28a745; color: white; border: none; border-radius: 5px; padding: 5px 10px;">Update</button>
                      <button class="delete-btn" data-id="${payment._id}" style="background-color: #dc3545; color: white; border: none; border-radius: 5px; padding: 5px 10px;">Delete</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `,
        width: '800px',
        showCloseButton: true,
        confirmButtonText: 'Close',
        didOpen: () => {
          document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => {
              const id = button.getAttribute('data-id');
              handleDeletePayment(id);
            });
          });

          document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', () => {
              const id = button.getAttribute('data-id');
              handleUpdatePayment(id);
            });
          });
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch payments. Please try again.',
        icon: 'error',
        confirmButtonText: 'Close'
      });
    }
  };

  const handleDeletePayment = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the payment.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        Swal.fire('Deleted!', 'Payment has been deleted.', 'success');
        handleShowPayments(); // Refresh the payments list after deletion
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete payment.', 'error');
      }
    }
  };

  const handleUpdatePayment = async (id) => {
    const paymentToUpdate = payments.find(payment => payment._id === id);

    if (!paymentToUpdate) {
      Swal.fire('Error!', 'Payment not found.', 'error');
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Update Payment',
      html: `
        <form id="update-form">
          <label for="amount">Amount:</label>
          <input type="number" id="amount" name="amount" value="${paymentToUpdate.amount}" required><br>

          <label for="type">Type:</label>
          <select id="type" name="type" required>
            ${paymentTypes.map(typeOption => `
              <option value="${typeOption}" ${paymentToUpdate.type === typeOption ? 'selected' : ''}>
                ${typeOption}
              </option>
            `).join('')}
          </select><br>

          <label for="date">Date:</label>
          <input type="date" id="date" name="date" value="${new Date(paymentToUpdate.date).toISOString().split('T')[0]}" required min="${today}"><br>

          <label for="description">Description:</label>
          <input type="text" id="description" name="description" value="${paymentToUpdate.description}" required><br>
        </form>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const form = document.getElementById('update-form');
        const updatedPayment = {
          amount: form.amount.value,
          type: form.type.value,
          date: form.date.value,
          description: form.description.value,
        };
        return updatedPayment;
      }
    });

    if (formValues) {
      const { isConfirmed } = await Swal.fire({
        title: 'Confirm Update',
        text: 'Do you want to update the payment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
      });

      if (isConfirmed) {
        try {
          await axios.put(`${API_URL}/${id}`, formValues, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          Swal.fire('Updated!', 'Payment has been updated.', 'success');
          handleShowPayments(); // Refresh the payments list after update
        } catch (error) {
          Swal.fire('Error!', 'Failed to update payment.', 'error');
        }
      }
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
  };

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const buttonStyle = {
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#0d3b66', // Button color
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Smooth transition for hover effect
  };

  const buttonHoverStyle = {
    backgroundColor: '#bfdbf7ff', // Button hover color
    color: '#0d3b66',
  };

  return (
    <div>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2>Add Payment</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={handleAmountChange}
          style={inputStyle}
        />
        
        <select value={type} onChange={handleTypeChange} style={inputStyle}>
          <option value="">Select Payment Type</option>
          {paymentTypes.map((typeOption, index) => (
            <option key={index} value={typeOption}>
              {typeOption}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          min={today}
          style={inputStyle}
        />
        
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
          style={inputStyle}
        />
        
        <button 
          type="submit" 
          style={buttonStyle} 
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ffffff'; 
            e.target.style.color = '#0d3b66'; 
            e.target.style.border = '2px solid #0d3b66';
          }} 
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#0d3b66'; 
            e.target.style.color = '#fff';
            e.target.style.border = '2px solid #0d3b66';
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} // Scale down on click
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          Add Payment
        </button>
      </form>
      <button 
        onClick={handleShowPayments} 
        style={{ ...buttonStyle, marginTop: '20px' }} 
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#ffffff'; 
          e.target.style.color = '#0d3b66'; 
          e.target.style.border = '2px solid #0d3b66';
        }} 
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#0d3b66'; 
          e.target.style.color = '#fff';
          e.target.style.border = '2px solid #0d3b66';
        }}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} // Scale down on click
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
      >
        Show Payments
      </button>
    </div>
  );
}

export default PaymentForm;
