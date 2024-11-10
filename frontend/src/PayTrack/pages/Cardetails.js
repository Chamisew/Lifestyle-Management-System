import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCard from '../components/AddCard';
import CardList from '../components/CardList';
import './Cardetails.css'; // Import the CSS file for styling
import IncomeSideMenu from '../pages/IncomeSideMenu';
import Footer from '../../components/Footer/Footer';
import Nav from '../../components/Nav/Nav';
function Cardetails() {
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Fetch user profile
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

    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);

    fetchUserProfile();
  }, []);

  return (
    <div className='carddetailcon'>
      <IncomeSideMenu />
      
    <div className='cardmain'>
    <Nav/>
      <div className='sectioncard'>
        <p>
          <strong>{`HELLO ${userName.toUpperCase()}`}</strong>
          <span className='date'>{` >> ${currentDate}`}</span>
        </p>
      </div>
      <div className="cardetails-container">
        <div className="add-card-section">
          <AddCard />
        </div>
        <div className="card-list-section">
        <CardList/>
        </div>
    
      </div>
     <Footer/>
    </div>
    
    </div>
    
  );
}

export default Cardetails;
