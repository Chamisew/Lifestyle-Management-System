import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Importing react-modal
import Swal from 'sweetalert2';
import { iconsImgs } from "../../utils/images"; // Adjust this import based on your image utilities
import "./Cards.css"; // Ensure you have your CSS styles for the cards

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({ Income: '', cardNumber: '', incomedate: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editCardId, setEditCardId] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cards', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(response.data);
      } catch (error) {
        setError('Failed to fetch card details');
      }
    };

    if (token) {
      fetchCards();
    }
  }, [token]);

  const openModal = (card = null) => {
    setFormData(card ? { Income: card.Income, cardNumber: card.cardNumber, incomedate: card.incomedate } : { Income: '', cardNumber: '', incomedate: '' });
    setIsEditing(!!card);
    setEditCardId(card ? card._id : null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({ Income: '', cardNumber: '', incomedate: '' });
    setEditCardId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/cards/${editCardId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(cards.map(c => (c._id === editCardId ? { ...c, ...formData } : c)));
        closeModal();
      } else {
        const response = await axios.post('http://localhost:5000/cards', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards([...cards, response.data.card]);
        closeModal();
      }
      Swal.fire({
        title: 'Success!',
        text: `Card ${isEditing ? 'updated' : 'added'} successfully!`,
        icon: 'success',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to ${isEditing ? 'update' : 'add'} card.`,
        icon: 'error',
      });
    }
  };

  const handleDeleteCardClick = async (cardId) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the card.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'orange',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/cards/${cardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(cards.filter(card => card._id !== cardId));
        Swal.fire('Deleted!', 'Card has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete card.', 'error');
      }
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  if (error) {
    return <div>{error}</div>;
  }

  const today  = new Date().toISOString().split('T')[0];
  return (
    <div className="grid-one-item grid-common grid-c1">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Cards</h3>
        <button className="grid-c-title-icon" onClick={() => openModal()} aria-label="Add New Card">
          <img src={iconsImgs.plus} alt="Add Card" />
        </button>
      </div>
      {cards.length > 0 ? (
        <div className="card-display">
          <div className="pagination-controls">
            <button onClick={handlePrevious} disabled={cards.length <= 1} className="income_button" style={{ color: 'black', marginBottom: '20px', backgroundColor: '#bfdbf7' }}>Previous</button>
          </div>
          <div className="grid-c1-content">
            <p>Income</p>
            {currentIndex < cards.length ? (
              <>
                <div className="lg-value">LKR{cards[currentIndex]?.Income}</div>
                <div className="card-wrapper">
                  <span className="card-pin-hidden">**** **** **** </span>
                  <span>{cards[currentIndex]?.cardNumber?.slice(-4) || "N/A"}</span>
                </div>
                <div className="card-wrapper">
                  <span>Date:</span>
                  <span>{new Date(cards[currentIndex]?.incomedate).toLocaleDateString() || "N/A"}</span>
                </div>
              </>
            ) : (
              <p>No card available at this index.</p>
            )}
            <div className="card-logo" style={{ marginLeft: '80%' }}>
              <div className="logo-shape1"></div>
              <div className="logo-shape2"></div>
            </div>
          </div>
          <div className="pagination-controls">
            <button onClick={handleNext} disabled={cards.length <= 1} className="income_button" style={{ color: 'black', backgroundColor: '#bfdbf7', marginBottom: '20px' }}>Next</button>
          </div>
          <div className="card-footer">
            <button onClick={() => openModal(cards[currentIndex])} className='income-edit-button'>Edit</button>
            <button onClick={() => handleDeleteCardClick(cards[currentIndex]?._id)} className='income-delete-button'>Delete</button>
          </div>
        </div>
      ) : (
        <p>No cards available</p>
      )}
      
      {/* Modal for Add/Edit Card */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} ariaHideApp={false}>
        <h2>{isEditing ? 'Edit Card' : 'Add New Card'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Income"
            value={formData.Income}
            onChange={(e) => setFormData({ ...formData, Income: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Income Date"
            max={today}
            value={formData.incomedate}
            onChange={(e) => setFormData({ ...formData, incomedate: e.target.value })}
            required
          />
          <button type="submit">{isEditing ? 'Update Card' : 'Add Card'}</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};  

export default Cards;
