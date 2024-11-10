import React from 'react';
import { FaStethoscope, FaHeadset, FaHome, FaBookOpen } from 'react-icons/fa'; // Import icons
import './PatientCare.css'; // Import the CSS file
import Nav from './Nav';
import Footer from './Footer';
const PatientCare = () => {
  return (
    <div>
      <Nav/>
    <div className="patient-care-container">
      <h1 className="header">Patient Care Services</h1>
      <p className="description">
        We are dedicated to providing personalized support tailored to your unique health needs. Explore our variety of healthcare services and connect with our expert care team.
      </p>

      <div className="service-container">
        {/* Medical Advice */}
        <div className="service-card">
          <FaStethoscope size={40} />
          <h2 className="service-title">Expert Medical Advice</h2>
          <p className="service-description">
            Consult with certified healthcare professionals for personalized medical advice tailored to your situation.
          </p>
        </div>

        {/* 24/7 Support */}
        <div className="service-card">
          <FaHeadset size={40} />
          <h2 className="service-title">24/7 Support</h2>
          <p className="service-description">
            Our dedicated care team is available around the clock to provide guidance and emergency support whenever you need it.
          </p>
        </div>

        {/* Home Care Assistance */}
        <div className="service-card">
          <FaHome size={40} />
          <h2 className="service-title">Home Care Assistance</h2>
          <p className="service-description">
            Receive professional assistance with home care services to ensure a smooth recovery process in the comfort of your home.
          </p>
        </div>

        {/* Health Education */}
        <div className="service-card">
          <FaBookOpen size={40} />
          <h2 className="service-title">Health Education</h2>
          <p className="service-description">
            Access a wealth of educational resources and webinars to empower you in managing your health and wellness effectively.
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default PatientCare;
