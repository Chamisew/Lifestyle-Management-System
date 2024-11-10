import React, { useState } from 'react';
import './DoctorAppointments.css'; // Import the CSS file
import Nav from './Nav';
import Footer from './Footer';
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const handleRedirect = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div>
      <Nav/>
    <div className="doctor-appointments-container">
      <h1 className="doctor-appointments-title">Doctor Appointments</h1>
      
      {/* Create Appointment Section */}
      <div className="appointment-create-section">
        <h2 className="appointment-create-title">Create Appointment</h2>
        <div className="appointment-create-buttons">
          <button
            className="appointment-button"
            onClick={() => handleRedirect('https://www.doc.lk')}
          >
            Book via Doc990
          </button>
          <button
            className="appointment-button"
            onClick={() => handleRedirect('https://www.echannelling.com')}
          >
            Book via E-Channeling
          </button>
        </div>
      </div>

      {/* Your Appointments Section */}
      <div className="appointment-list-section">
        <h2 className="appointment-list-title">Your Appointments</h2>
        {appointments.length > 0 ? (
          <ul className="appointment-list">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="appointment-list-item">
                <span className="appointment-service">{appointment.service}</span> on{' '}
                <span className="appointment-date">{appointment.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-appointments-message">You have no upcoming appointments yet.</p>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default DoctorAppointments;
