import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-title">Confirm Action</h2>
        <p className="popup-message">{message}</p>
        <div className="popup-button-group">
          <button className="popup-confirm-button" onClick={onConfirm}>
            Delete
          </button>
          <button className="popup-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
