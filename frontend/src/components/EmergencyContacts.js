import React from 'react';
import asiri from '../images/logo.png';
import ruhunu from '../images/ruhunu_hospital_logo.png';
import lanka from '../images/lankahospitals-logo.png';
import suwa from '../images/hq-logo-1-scaled.jpg';
import './EmergencyContacts.css'
import Nav from './Nav';
import Footer from './Footer';
const EmergencyContacts = () => {
  const hospitals = [
    {
      name: 'Asiri Hospital',
      url: 'https://asirihealth.com/',
      logo: asiri,
    },
    {
      name: 'Ruhunu Hospital',
      url: 'https://www.ruhunuhospital.lk/',
      logo: ruhunu,
    },
    {
      name: 'Lanka Hospital',
      url: 'https://www.lankahospitals.com/',
      logo: lanka,
    },
    {
      name: 'Suwa Sariya',
      url: 'https://www.1990.lk/',
      logo: suwa,
    },
  ];

  return (
    <div>
      <Nav/>
    <div className="emergency-container">
      <h1 className="emergency-title">Emergency Contacts</h1>
      <h2 className="emergency-subtitle">Nearby Hospitals</h2>

      <ul className="hospital-list">
        {hospitals.map((hospital, index) => (
          <li key={index} className="hospital-item">
            <a
              href={hospital.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hospital-link"
            >
              <img src={hospital.logo} alt={`${hospital.name} logo`} className="hospital-logo"/>
              <span className="hospital-name">{hospital.name}</span>
              <button className="hospital-button">Visit Website</button>
            </a>
          </li>
        ))}
      </ul>
    </div>
    <Footer/>
    </div>
  );
};

export default EmergencyContacts;
