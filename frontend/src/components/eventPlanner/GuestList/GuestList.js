import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; 
import Swal from 'sweetalert2';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import "./GuestList.css";

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/guests', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setGuests(response.data || []); 
      } catch (err) {
        console.error('Error fetching guests:', err);
        setError('Failed to fetch guests.');
      }
    };

    fetchGuests();
  }, []);

  const handleUpdate = (guestId) => {
    navigate(`/editguest/${guestId}`);
  };

  const handleDelete = (guestId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this guest?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/guests/${guestId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          setGuests(guests.filter(guest => guest._id !== guestId));
          Swal.fire('Deleted!', 'The guest has been deleted.', 'success');
        } catch (err) {
          console.error('Error deleting guest:', err);
          setError('Failed to delete guest.');
          Swal.fire('Error!', 'Failed to delete the guest.', 'error');
        }
      }
    });
  };

  const handleNavigateToSendInvitation = (guestId) => {
    navigate(`/sendinvitation/${guestId}`);
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (guest.eventId && guest.eventId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
   <div className='guest-list'>
     <Nav/>
    <div className="guest-list-wrapper">
     
      <h2 className="guest-list-title">Guest List</h2>
      {error && <p className="guest-list-error">{error}</p>}
      <div className="guest-list-search">
      <input
          type="text"
          placeholder="Search guests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="guest-list-search-box"
        />
        <FaSearch className="guest-list-search-icon" />
        </div>
      <table className="guest-list-table">
        <thead className="guest-list-thead">
          <tr className="guest-list-thead-row">
            <th className="guest-list-th">Name</th>
            <th className="guest-list-th">Event Name</th>
            <th className="guest-list-th">Decision Status</th>
            <th className="guest-list-th">Invitation Sent</th>
            <th className="guest-list-th">Actions</th>
          </tr>
        </thead>
        <tbody className="guest-list-tbody">
        {filteredGuests.map(guest => (
            <tr key={guest._id} className="guest-list-row">
              <td className="guest-list-td">{guest.name || 'N/A'}</td>
              <td className="guest-list-td">{guest.eventId ? guest.eventId.name : 'N/A'}</td>
              <td className="guest-list-td">{guest.invitationStatus || 'N/A'}</td>
              <td className="guest-list-td">{guest.invitationSent ? 'Yes' : 'No'}</td>
              <td className="guest-list-td">
                <button className="guest-list-btn guest-list-update-btn" onClick={() => handleUpdate(guest._id)}>Update</button>
                <button className="guest-list-btn guest-list-delete-btn" onClick={() => handleDelete(guest._id)}>Delete</button>
                <button className="guest-list-btn guest-list-invite" onClick={() => handleNavigateToSendInvitation(guest._id)}>Invite</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Footer/>
    </div>

  );
};

export default GuestList;
