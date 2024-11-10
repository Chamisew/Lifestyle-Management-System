import React from 'react';
import './Room.css';
import Cards from '../components/Cards/Cards';
import Transactions from '../components/Transactions/Transactions';
import Budget from '../components/Budget/Budget';

const Rooms = () => {
  return (
    <section className="rooms-section">
      <h2>ADD YOUR INCOME HERE</h2>
      <div className="rooms-container">
        <div className="room-card">
        <Budget/>
        </div>
        <div className="room-card">
         <Transactions/>
        </div>
        <div className="room-card">
         <Cards/>
        </div>
      </div>
    </section>
  );
};

export default Rooms;
