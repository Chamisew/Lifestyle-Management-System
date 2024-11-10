import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SendWishAndGift.css';
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';



const SendWishAndGift = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { id, email, wish } = location.state || {};
    const [editedEmail, setEditedEmail] = useState(email || '');
    const [editedWish, setEditedWish] = useState(wish || '');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleUpdateWishAndEmail = async () => {
        try {
            await axios.put(`http://localhost:5000/eventMind/reminders/${id}`, { email: editedEmail, wish: editedWish });
            setShowModal(true);
        } catch (error) {
            console.error('Error updating wish and email:', error);
        }
    };

    const handleSelectGifts = () => {
        navigate('/gift-options', { state: { reminderId: id } });
    };

    const handleSendWish = () => {
        console.log("Wish has been sent!");
        setMessage("Wish sent successfully!");
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
      <Nav/>

        <div className="send-wish-and-gift">
            <h2>Send Wish and Gift</h2>
            <div className="form-container">
                <label>Email:</label>
                <div className="email-input">
                    <input 
                        type="email" 
                        value={editedEmail} 
                        onChange={(e) => setEditedEmail(e.target.value)} 
                    />
                </div>
                <label>Wish:</label>
                <div className="wish-input">
                    <textarea 
                        value={editedWish} 
                        onChange={(e) => setEditedWish(e.target.value)} 
                    />
                </div>
                {message && <p className="success-message">{message}</p>}
                <div className="button-group">
                    <button className="update-button" onClick={handleUpdateWishAndEmail}>Update Wish & Email</button>
                    <button className="select-gift-button" onClick={handleSelectGifts}>Select Gifts</button>
                    <button className="send-gift-button" onClick={handleSendWish}>Send Wish</button>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Details Updated</h3>
                        <p>Email: <strong>{editedEmail}</strong></p>
                        <p>Wish: <strong>{editedWish}</strong></p>
                        <div className="close-button-container">
                            <button className="close-modal-button" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footer/>
    </div>

    );
};

export default SendWishAndGift;
