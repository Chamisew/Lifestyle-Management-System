import React from "react";
import "./Footer.css";
import Logo from '../../MEETIMAGES/Household lifestyle partner-01-01.png'; // Add your logo path
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">

      <div className="container-footer" id="particles-js">
        <div className="footer-logo-section">
          <img src={Logo} alt="Site Logo" className="footer-logo" />
          <h2 className="footer-title">Life Style Planner</h2>
          <p className="footer-description">Your ultimate partner for managing your daily tasks and events.</p>
          <p className="footer-description">Empowering you to organize life effortlessly.</p>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h3 className="footer-heading">Learn</h3>
            <ul className="footer-links">
              <li><a href="#">Failed Startups</a></li>
              <li><a href="#">Successful Startups</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Tools</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Other</h3>
            <ul className="footer-links">
              <li><a href="#">Sponsor Us!</a></li>
              <li><a href="#">Contribute</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Follow Us</h3>
            <div className="social-links">
            <a href="#" aria-label="Twitter">
        <FaTwitter size={30} />
      </a>
      <a href="#" aria-label="Instagram">
        <FaInstagram size={30} />
      </a>
      <a href="#" aria-label="Facebook">
        <FaFacebook size={30} />
      </a>
            </div>
            <p className="footer-contact">Email us at: <a href="mailto:example@example.com">example@example.com</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;