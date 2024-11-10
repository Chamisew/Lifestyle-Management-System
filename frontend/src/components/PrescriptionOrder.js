import React from 'react';
import './OrderPrescription.css'; // Import the CSS file
import Nav from './Nav';
import Footer from './Footer';
const OrderPrescription = () => {
  const handleOrderPrescription = () => {
    window.open('https://www.echannelling.com/order-medicine', '_blank');
  };

  return (
    <div>
      <Nav/>
    <div className="order-prescription-container">
      <h1 className="order-prescription-header">Order Medical Prescriptions</h1>
      <p className="order-prescription-description">
        Click the button below to order your medical prescriptions online. It’s quick and easy!
      </p>
      <button
        className="order-prescription-button" // Add class for styling
        onClick={handleOrderPrescription}
      >
        Order Prescriptions
      </button>
    </div>
    <Footer/>
    </div>
  );
};

export default OrderPrescription;
