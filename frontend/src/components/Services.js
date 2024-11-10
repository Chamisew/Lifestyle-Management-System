import React from 'react';
import { Link } from 'react-router-dom';
import { FaPills, FaPhoneAlt, FaCalendarAlt, FaPrescriptionBottleAlt, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa'; // Importing icons
import './Servicesabhilash.css'
import Nav from './Nav';
import Footer from './Footer';
const Services = () => {
  return (
    <div>
      <Nav/>
    <div className="service-container">
      <h1 className="service-title">Welcome to Your Health Dashboard</h1>

      <div className="service-grid">
        {/* Manage Medication */}
        <Link to="/dashboard" className="service-card">
          <div className="service-icon">
            <FaPills />
            <h2 className="service-card-title">Manage Medication</h2>
          </div>
          <p className="service-description">Click here to manage your medications and tasks.</p>
        </Link>

        {/* Emergency Contacts */}
        <Link to="/emergency-contacts" className="service-card">
          <div className="service-icon">
            <FaPhoneAlt />
            <h2 className="service-card-title">Emergency Contacts</h2>
          </div>
          <p className="service-description">Click here for your emergency contact services.</p>
        </Link>

        {/* Doctor Appointments */}
        <Link to="/doctor-appointments" className="service-card">
          <div className="service-icon">
            <FaCalendarAlt />
            <h2 className="service-card-title">Doctor Appointments</h2>
          </div>
          <p className="service-description">Click here to schedule an online appointment.</p>
        </Link>

        {/* Prescription Order */}
        <Link to="/prescription-order" className="service-card">
          <div className="service-icon">
            <FaPrescriptionBottleAlt />
            <h2 className="service-card-title">Prescription Order</h2>
          </div>
          <p className="service-description">Click here to order your medical prescriptions.</p>
        </Link>

        {/* Google Map Access */}
        <Link to="/google-map-access" className="service-card">
          <div className="service-icon">
            <FaMapMarkerAlt />
            <h2 className="service-card-title">Find Pharmacies & Hospitals</h2>
          </div>
          <p className="service-description">Click here to search for the nearest hospital using Google Maps.</p>
        </Link>

        {/* Patient Care */}
        <Link to="/patient-care" className="service-card">
          <div className="service-icon">
            <FaUserMd />
            <h2 className="service-card-title">Patient Care</h2>
          </div>
          <p className="service-description">Click here to access patient care services and support.</p>
        </Link>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Services;
