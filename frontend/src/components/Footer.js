import React from "react";
import { FaPhone, FaEnvelope, FaInfoCircle, FaQuestionCircle, FaClipboardCheck } from 'react-icons/fa';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="xxfooter-container">
      <div className="xxfooter-services">
        <h4 className="xxfooter-title">Services</h4>
        <ul className="xxfooter-list">
          {["Auto Assist", "Meet Assist", "Shop Mart", "Event Minder", "Health Mate", "Finance Guard", "Pay Track", "Event Planner"].map(service => (
            <li key={service} className="xxfooter-list-item">
              <FaClipboardCheck className="xxfooter-icon" />
              {service}
            </li>
          ))}
        </ul>
      </div>
      <div className="xxfooter-contact">
        <h4 className="xxfooter-title">Contact Us</h4>
        <ul className="xxfooter-list">
          <li className="xxfooter-list-item">
            <FaPhone className="xxfooter-icon" />
            0716718281
          </li>
          <li className="xxfooter-list-item">
            <FaEnvelope className="xxfooter-icon" />
            Email:{" "}
            <a href="mailto:lifest@conts.lk" className="footer-email-link">
              lifest@conts.lk
            </a>
          </li>
        </ul>
      </div>
      <div className="xxfooter-info">
        <h4 className="xxfooter-title">Life Style Planner</h4>
        <ul className="xxfooter-list">
          {["About Us", "FAQ", "Privacy Policy", "Terms and Conditions"].map(item => (
            <li key={item} className="xxfooter-list-item">
              <FaInfoCircle className="xxfooter-icon" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
