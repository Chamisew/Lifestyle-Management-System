import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PayAddReminder = () => {
  const [form, setForm] = useState({
    date: '',
    amount: '',
    description: '',
    phonenumber: '',
  });

  const [reminders, setReminders] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'description') {
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
      setForm((prevForm) => ({
        ...prevForm,
        [name]: filteredValue,
      }));
    } else if (name === 'phonenumber') {
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

    if (form.phonenumber.length !== 10) {
      Swal.fire('Error', 'Phone number must be exactly 10 digits long.', 'error');
      return;
    }

    if (form.date <= today) {
      Swal.fire('Error', 'Reminder date must be a future date.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/payreminders', form, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Reminder added:', response.data);
      Swal.fire('Success', 'Reminder has been added successfully.', 'success');
      setForm({
        date: '',
        amount: '',
        description: '',
        phonenumber: '',
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
      Swal.fire('Error', 'Error adding reminder. Please try again.', 'error');
    }
  };

  const handleShowReminders = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/payreminders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const reminders = response.data;
      setReminders(reminders);

      if (reminders.length === 0) {
        Swal.fire('No reminders found', '', 'info');
        return;
      }

      let htmlContent = '';
      reminders.forEach((reminder) => {
        htmlContent += `
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
          <p style="font-size: 16px; margin: 5px 0;">
            <strong>Date:</strong> ${new Date(reminder.date).toLocaleDateString()}
          </p>
          <p style="font-size: 16px; margin: 5px 0;">
            <strong>Amount:</strong> ${reminder.amount}
          </p>
          <p style="font-size: 16px; margin: 5px 0;">
            <strong>Description:</strong> ${reminder.description}
          </p>
          <p style="font-size: 16px; margin: 5px 0;">
            <strong>Phone Number:</strong> ${reminder.phonenumber}
          </p>
          <button id="edit-${reminder._id}" style="padding: 8px 12px; background-color: #0d3b66; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Edit
          </button>
          <button class="delete-button" id="delete-${reminder._id}" style="padding: 8px 12px; background-color: #0d3b66; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
            Delete
          </button>
        </div>
        <hr style="border: 1px solid #ccc;" />
        `;
      });

      Swal.fire({
        title: 'Reminders List',
        html: htmlContent,
        width: 600,
        showCloseButton: true,
        showConfirmButton: false,
        didOpen: () => {
          reminders.forEach((reminder) => {
            document.getElementById(`edit-${reminder._id}`).addEventListener('click', () => {
              handleEditReminder(reminder);
            });

            document.getElementById(`delete-${reminder._id}`).addEventListener('click', async () => {
              const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This reminder will be permanently deleted!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
              });

              if (result.isConfirmed) {
                try {
                  await axios.delete(`http://localhost:5000/api/payreminders/${reminder._id}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  Swal.fire('Deleted!', 'The reminder has been deleted.', 'success');
                  handleShowReminders(); // Refresh the list
                } catch (error) {
                  console.error('Error deleting reminder:', error);
                  Swal.fire('Error!', 'Failed to delete the reminder.', 'error');
                }
              }
            });
          });
        }
      });
    } catch (error) {
      console.error('Error fetching reminders:', error);
      Swal.fire('Error', 'Failed to fetch reminders.', 'error');
    }
  };

  const handleEditReminder = (reminder) => {
    Swal.fire({
      title: 'Edit Reminder',
      html: `
        <form id="edit-form">
          <label for="date">Date:</label>
          <input type="date" id="date" name="date" value="${new Date(reminder.date).toISOString().split('T')[0]}" min="${today}" required><br>
          <label for="amount">Amount:</label>
          <input type="number" id="amount" name="amount" value="${reminder.amount}" required><br>
          <label for="description">Description:</label>
          <input type="text" id="description" name="description" value="${reminder.description}" pattern="[A-Za-z\\s]*" title="Only letters and spaces are allowed" required><br>
          <label for="phonenumber">Phone Number:</label>
          <input type="text" id="phonenumber" name="phonenumber" value="${reminder.phonenumber}" pattern="\\d{10}" title="Phone number must be exactly 10 digits long" required><br>
          <button type="submit" style="background-color: #0d3b66; color: white;">Update Reminder</button>
        </form>
      `,
      width: 400,
      padding: '20px',
      showCloseButton: true,
      showConfirmButton: false,
      didOpen: () => {
        const formElement = document.getElementById('edit-form');
        formElement.addEventListener('submit', async (e) => {
          e.preventDefault();
  
          const updatedReminder = {
            date: formElement.querySelector('#date').value,
            amount: formElement.querySelector('#amount').value,
            description: formElement.querySelector('#description').value,
            phonenumber: formElement.querySelector('#phonenumber').value,
          };
  
          try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/payreminders/${reminder._id}`, updatedReminder, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            Swal.fire('Updated!', 'The reminder has been updated.', 'success');
            handleShowReminders(); // Refresh the list
          } catch (error) {
            console.error('Error updating reminder:', error);
            Swal.fire('Error!', 'Failed to update the reminder.', 'error');
          }
        });
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{
          maxWidth: '400px',
          width: '100%',
          margin: '0 auto',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'box-shadow 0.3s ease',
        }}>
        <h1 style={{
          fontSize: '26px',
          marginBottom: '25px',
          textAlign: 'center',
          color: '#0d3b66',
        }}>Add Payment Reminder</h1>
        <label htmlFor="date" style={{
          fontSize: '16px',
          color: '#0d3b66',
        }}>Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          min={today}
          required
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />

        <label htmlFor="amount" style={{
          fontSize: '16px',
          color: '#0d3b66',
        }}>Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />

        <label htmlFor="description" style={{
          fontSize: '16px',
          color: '#0d3b66',
        }}>Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          pattern="[A-Za-z\s]*"
          title="Only letters and spaces are allowed"
          required
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />

        <label htmlFor="phonenumber" style={{
          fontSize: '16px',
          color: '#0d3b66',
        }}>Phone Number:</label>
        <input
          type="text"
          id="phonenumber"
          name="phonenumber"
          value={form.phonenumber}
          onChange={handleChange}
          pattern="\d{10}"
          title="Phone number must be exactly 10 digits long"
          required
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />

        <button type="submit" style={{
          backgroundColor: '#0d3b66',
          color: 'white',
          padding: '12px 20px',
          border: '2px solid #0d3b66', 
          fontSize: '16px',
          width: '100%',
          cursor: 'pointer',
          transition: 'background-color 0.3s, color 0.3s, transform 0.2s'
        }}onMouseEnter={(e) => {
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
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>
          Add Reminder
        </button>
      </form>
      <div style={{
        maxWidth: '400px',
        margin: '20px auto',
      }}>
        <button onClick={handleShowReminders} style={{
          backgroundColor: '#0d3b66',
          color: '#fff',
          padding: '12px 24px', // Updated padding for larger button
          fontSize: '16px',
          fontWeight: 'bold', // Added bold font weight
          width: '100%',
          cursor: 'pointer',
          border: '2px solid #0d3b66', // Ensuring the border is solid with #0d3b66 color
          marginTop: '10px', // Added margin top
          marginLeft: '10px', // Added margin left
          marginBottom: '30px', // Added margin bottom
          transition: 'background-color 0.3s, color 0.3s, transform 0.2s'
        }}onMouseEnter={(e) => {
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
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>
          Show All Reminders
        </button>
      </div>
    </div>
  );
};

export default PayAddReminder;
