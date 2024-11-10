import React from 'react';
import './About.css';
import Loans from '../components/Loans/Loans';
import Financial from '../components/Financial/Financial';

const About = () => {
  return (
    <section className="incomeabout-section">
      <div className="incomeabout-text">
        <h2>LOANS</h2>
        <p>Ensure that you can comfortably afford the monthly payments without straining your budget...</p>
        <br></br>
        <Financial/>
       
      </div>
      <div className="incomeabout-stats">
        <div className="incomeabout-stat-item">
         
        </div>
        <div className="incomeabout-stat-item">
        
        </div>
       
        <Loans/>
        </div>
      
    </section>
  );
};

export default About;
