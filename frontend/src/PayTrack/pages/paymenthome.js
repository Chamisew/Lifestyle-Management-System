import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaymentForm from '../components/PaymentForm';
import YearlyPayments from '../components/YearlyPayments';
import MonthlyPaymentsChart from '../components/MonthlyPaymentsChart';
import PamentBytepe from '../components/PamentBytepe';    
import './paymenthome.css';
import PayAddReminder from '../components/payAddReminder'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF autotable plugin
import IncomeSideMenu from './IncomeSideMenu'; // Import the side menu component
import Footer from '../../components/Footer/Footer';
import Nav from '../../components/Nav/Nav';
function PaymentHome() {
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    // Fetch user profile and set userName
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found.');
          return;
        }
        const response = await axios.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
    
    // Set current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString(undefined, options));

    // Fetch payment data
    const fetchPaymentData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found.');
          return;
        }
        const response = await axios.get('/api/payments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentData(response.data);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };

    fetchPaymentData();
  }, []);

  // Function to generate and download the PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Payment Report', 14, 16);

    // Add table
    const tableColumn = ['Date', 'Amount', 'Type'];
    const tableRows = paymentData.map(payment => [
      payment.date,
      payment.amount.toFixed(2),
      payment.type
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 30 });

    // Save the PDF
    doc.save(`payment_report_${currentDate}.pdf`);
  };

  return (
    <div>
     <Nav/>
    <div className="paymenthomecontainer">
  <IncomeSideMenu className="side-menu" /> 
  <div className="main-content-payment">
   
   
    <header>
      <p>
        <strong>{`Hello, ${userName.toUpperCase()}`}</strong>
        <span className='date'>{` >> ${currentDate}`}</span>
      </p>
      <div className="video-line"></div>
      <PamentBytepe />
    </header>
    <div className="payment-home-container">
      <div className="payment-form">
        <PaymentForm />
        <MonthlyPaymentsChart />
      </div>
      <div className="right-panel-pay">
        <div className="yearly-payments">
          <YearlyPayments />
        </div>
        <div className="monthly-payments-chart">
          <PayAddReminder/>
          <div className="report-button">
          <button onClick={generatePDF} className="btn-download">
            Download Payment Report
          </button>
        </div>
        </div>
      </div>
    </div>
  
  </div>
</div>
<Footer/>
</div>
  );
}

export default PaymentHome;
