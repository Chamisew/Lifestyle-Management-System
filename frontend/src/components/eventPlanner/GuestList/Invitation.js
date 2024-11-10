import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import './Invitation.css';

const Invitation = () => {
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGuestEmail = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure token is retrieved
        const response = await axios.get(`http://localhost:5000/api/guests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        
        // Check if the response is valid and contains an email
        if (response.data && response.data.email) {
          setEmail(response.data.email);
        } else {
          setError('Guest email not found.');
        }
      } catch (err) {
        console.error('Error fetching guest email:', err);
        setError('Failed to fetch guest email.'); // Simplified error message
      }
    };

    fetchGuestEmail();
  }, [id]);

  const handleSendInvitation = async () => {
    if (!invitationMessage) {
      setError('Invitation message cannot be empty.');
      return;
    }

    // Retrieve token from local storage
    const token = localStorage.getItem('token'); // Ensure token is available

    try {
      const response = await axios.post(
        `http://localhost:5000/api/invitation/${id}`,
        { invitationMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      console.error('Error sending invitation:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send the invitation. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className='invitation'>
    <Nav/>
        <div className="invitation-form">
          
          <h2 className="invitation-form-h2">Invitation</h2>
          <p className="invitation-form-p">Create and send your Invitation</p>

          {error && <p className="error">{error}</p>}

          <div className="invitation-form-group">
            <label htmlFor="invitationMessage">Type your Invitation</label>
            <textarea
              id="invitationMessage"
              value={invitationMessage}
              onChange={(e) => setInvitationMessage(e.target.value)}
              placeholder="Type your invitation..."
            />
          </div>

          <button onClick={handleSendInvitation} className="invitation-send-button">
            SEND
          </button>
          </div>
          <Footer/>
        </div>

  );
};

export default Invitation;
