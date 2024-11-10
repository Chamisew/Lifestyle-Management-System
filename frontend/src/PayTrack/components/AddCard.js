import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddCard.css'; 

const AddCard = () => {
  const [form, setForm] = useState({
    reminderDate: '',
    expireDate: '',
    phoneNumber: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form state with formatted phone number
    if (name === 'phoneNumber') {
      const formattedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setForm((prevForm) => ({
        ...prevForm,
        [name]: formattedValue,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reminderDate = new Date(form.reminderDate);
    const expireDate = new Date(form.expireDate);

    if (reminderDate < new Date(today)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Reminder date cannot be in the past.',
      });
      return;
    }

    if (expireDate <= reminderDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Expiry date must be greater than the reminder date.',
      });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cards', form, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Card added successfully!',
      }).then(() => {
        setForm({ reminderDate: '', expireDate: '', phoneNumber: '' });
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error adding card. Please try again.',
      });
    }
  };

  return (
    <div className="add-card-container">
      <form onSubmit={handleSubmit} className="add-card-form">
        <h1 className="add-card-title">Add Card</h1>

        <div className="add-card-input-group">
          <label htmlFor="reminderDate" className="add-card-label">
            Date of Reminder:
          </label>
          <input
            type="date"
            id="reminderDate"
            name="reminderDate"
            value={form.reminderDate}
            onChange={handleChange}
            min={today}
            required
            className="add-card-input"
          />
        </div>

        <div className="add-card-input-group">
          <label htmlFor="expireDate" className="add-card-label">
            Date of Expiry:
          </label>
          <input
            type="date"
            id="expireDate"
            name="expireDate"
            value={form.expireDate}
            onChange={handleChange}
            min={today}
            required
            className="add-card-input"
          />
        </div>

        <div className="add-card-input-group">
          <label htmlFor="phoneNumber" className="add-card-label">
            Phone Number:
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            maxLength="10"
            pattern="[0-9]*"
            required
            className="add-card-input"
          />
        </div>

        <div className="add-card-button-container">
          <button
            type="submit"
            className="add-card-button"
          >
            Add Card
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCard;
