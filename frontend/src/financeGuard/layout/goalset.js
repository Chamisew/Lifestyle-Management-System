import React from 'react';
import './goalset.css';
import Goals from '../components/Goals/Goals';

const goalset = () => {
  return (
    <footer className="goalsert">
      <div className="goalsert-container">
        <div className="goalsert-section hotelier">
          <h2>GOALS</h2>
          <p>
          you stay motivated and focused on achieving financial success.
          This makes managing personal finances more structured, encouraging better saving habits and financial discipline.
          </p>
        </div>
        <div className="goalsert-section services">
         <Goals/>
        </div>
      </div>
    
    </footer>
  );
};

export default goalset;