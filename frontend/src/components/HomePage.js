import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import echannelling from "../images/docmeet.jpg";
import doctor from "../images/echannel.jpg";
import prescriptions from "../images/prescriptions.jpg";
import doc990 from "../images/Doc990.png";
import echann from "../images/echannelingnew.png";
import './HomePage.css';
import Nav from './Nav';
import Footer from './Footer';
const HomePage = () => {
  const services = [
    {
      name: "E Channeling",
      description:
        "Enjoy the convenience of scheduling appointments online with ease. Book appointments with your preferred doctor.",
      imgSrc: echannelling,
    },
    {
      name: "Doctor Meet",
      description:
        "Connect with doctors online and get medical consultations at the comfort of your home.",
      imgSrc: doctor,
    },
    {
      name: "Pharmacy Orders",
      description:
        "Order your medications online and have them delivered to your doorstep.",
      imgSrc: prescriptions,
    },
  ];

  return (
    <div>
         <Nav/>
    <div className="hp-container">
   
      <h1 className="hp-title">Welcome to HealthMate</h1>

      {/* Buttons */}
      <div className="hp-buttons-container">
        <Link to="/add">
          <button className="hp-button hp-add-reminder-btn">Add Reminder</button>
        </Link>
        <Link to="/remainderlist">
          <button className="hp-button hp-view-reminder-btn">View Reminders</button>
        </Link>
        <Link to="/emergency-contacts">
          <button className="hp-button hp-emergency-contacts-btn">Emergency Contacts</button>
        </Link>
      </div>

      {/* Services Cards */}
      <div className="hp-services-grid">
        {services.map((service, index) => (
          <div key={index} className="hp-service-card">
            <img
              src={service.imgSrc}
              alt={service.name}
              className="hp-service-img"
            />
            <h3 className="hp-service-title">{service.name}</h3>
            <p className="hp-service-description">{service.description}</p>
          </div>
        ))}
      </div>

      {/* E-Channeling Section */}
      <h2 className="hp-echannelling-title">E-Channeling Services</h2>

      <div className="hp-echannelling-section">
        <div className="hp-echannelling-card">
          <div className="hp-echannelling-card-content">
            <img
              src={echann}
              alt="E-Channeling"
              className="hp-echannelling-img"
            />
            <div>
              <h3 className="hp-echannelling-card-title">E-CHANNELLING</h3>
              <p className="hp-echannelling-description">
                e-Channelling is the most trustworthy & reliable online platform
                in Sri Lanka for scheduling medical consultations.
              </p>
            </div>
          </div>
          <a
            href="https://www.echannelling.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hp-echannelling-btn"
          >
            Visit E-Channeling
          </a>
        </div>

        <div className="hp-echannelling-card">
          <div className="hp-echannelling-card-content">
            <img
              src={doc990}
              alt="Doc990"
              className="hp-echannelling-img"
            />
            <div>
              <h3 className="hp-echannelling-card-title">DOC990</h3>
              <p className="hp-echannelling-description">
                Doc990 offers online medical consultations with trusted doctors across Sri Lanka.
              </p>
            </div>
          </div>
          <a
            href="https://www.doc.lk"
            target="_blank"
            rel="noopener noreferrer"
            className="hp-echannelling-btn"
          >
            Visit DOC990
          </a>
        </div>
      </div>
     
    </div>
     <Footer/>
     </div>
  );
};

export default HomePage;
