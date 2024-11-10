import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CardList.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
};

const getRandomGradient = () => {
  const colors = [
    ['#ff9a9e', '#fad0c4'],
    ['#a18cd1', '#fbc2eb'],
    ['#f6d365', '#fda085'],
    ['#a2c2e7', '#b9e3c6'],
    ['#ff6f61', '#deaaed'],
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return `linear-gradient(to bottom right, ${colors[randomIndex][0]} 70%, ${colors[randomIndex][1]} 30%)`;
};

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Define fetchCards here
  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cards', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCards(response.data);
    } catch (error) {
      setError('Error fetching cards. Please try again.');
      console.error('Error fetching cards:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found.');
          return;
        }
        const response = await axios.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
    fetchCards(); // Call fetchCards on mount
  }, []); // Only run once on mount

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/cards/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then(() => {
            fetchCards(); // Call fetchCards after deletion
            Swal.fire('Deleted!', 'Your card has been deleted.', 'success');
          })
          .catch((error) => {
            setError('Error deleting card. Please try again.');
            Swal.fire('Error!', 'Error deleting card. Please try again.', 'error');
            console.error('Error deleting card:', error);
          });
      }
    });
  };

  const handleUpdate = (card) => {
    Swal.fire({
      title: 'Update Card',
      html: `
        <input id="phoneNumber" class="swal2-input" placeholder="Phone Number" value="${card.phoneNumber}" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
        <input id="reminderDate" type="date" class="swal2-input" placeholder="Reminder Date" value="${card.reminderDate.substring(0, 10)}">
        <input id="expireDate" type="date" class="swal2-input" placeholder="Expire Date" value="${card.expireDate.substring(0, 10)}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const phoneNumber = Swal.getPopup().querySelector('#phoneNumber').value;
        const reminderDate = Swal.getPopup().querySelector('#reminderDate').value;
        const expireDate = Swal.getPopup().querySelector('#expireDate').value;

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
          Swal.showValidationMessage('Phone number must be exactly 10 digits.');
          return null;
        }

        return { phoneNumber, reminderDate, expireDate };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axios
          .put(`http://localhost:5000/api/cards/${card._id}`, result.value, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then(() => {
            fetchCards(); // Call fetchCards after update
            Swal.fire('Updated!', 'Your card has been updated.', 'success');
          })
          .catch((error) => {
            setError('Error updating card. Please try again.');
            Swal.fire('Error!', 'Error updating card. Please try again.', 'error');
            console.error('Error updating card:', error);
          });
      }
    });
  };

  const filteredCards = useMemo(() => 
    cards.filter(card => card.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())), 
    [cards, searchTerm]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSearchTerm(value);
  };

  return (
    <div className="card-list-container">
      <div className="card-list-title-container">
        <h1 className="card-list-title">Card List</h1>
      </div>

      <input
        type="text"
        placeholder="Search by phone number"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      {error && <p className="error-message">{error}</p>}
      <div className='cardlist'>
        <ul>
          {filteredCards.length === 0 ? (
            <p>No cards found.</p>
          ) : (
            filteredCards.map((card) => (
              <li key={card._id} className="card-item" style={{ background: getRandomGradient() }}>
                <div className="card-content">
                  <p className="card-date">Reminder Date: {formatDate(card.reminderDate)}</p>
                  <p className="card-date">Expiration Date: {formatDate(card.expireDate)}</p>
                  <p className="cardholder-name">{card.phoneNumber}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleDelete(card._id)} className="delete-button">
                    Delete
                  </button>
                  <button onClick={() => handleUpdate(card)} className="update-button">
                    Update
                  </button>
                </div>
                <div className="card-type">{userName.toUpperCase()}</div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CardList;
