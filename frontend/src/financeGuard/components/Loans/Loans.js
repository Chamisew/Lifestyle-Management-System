import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2"; // Import SweetAlert2
import { iconsImgs } from "../../utils/images";
import "./Loans.css";

Modal.setAppElement("#root");

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalLoan: 0, totalPaid: 0, amountLeft: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  const token = localStorage.getItem('token');

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/loans", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanSummary = async () => {
    try {
      const response = await axios.get("http://localhost:5000/loans/summary", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching loan summary:", error);
    }
  };

  const addLoan = async (e) => {
    e.preventDefault();
    const newLoan = {
      totalAmount,
      amountPaid,
    };

    try {
      await axios.post("http://localhost:5000/loans", newLoan, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTotalAmount('');
      setAmountPaid('');
      setModalIsOpen(false);
      fetchLoans();
      fetchLoanSummary();

      // Success alert using SweetAlert2
      Swal.fire({
        title: "Success!",
        text: "Loan added successfully!",
        icon: "success",
        confirmButtonText: "OK"
      });
    } catch (error) {
      console.error("Error adding loan:", error);

      // Error alert using SweetAlert2
      Swal.fire({
        title: "Error!",
        text: "Failed to add loan. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchLoanSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const percentage = (summary.totalPaid / summary.totalLoan) * 100 || 0;

  return (
    <div className="subgrid-two-item grid-common grid-c7">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Loans</h3>
        <button className="grid-c-title-icon" onClick={() => setModalIsOpen(true)}>
          <img src={iconsImgs.plus} alt="Add Loan" />
        </button>
      </div>
      <div className="grid-c7-content">
        <div className="loanprogress-bar small">
          <div className="percent">
            <svg width="100" height="100" viewBox="0 0 120 120">
              <circle className="bg" cx="60" cy="60" r="50" strokeWidth="10" />
              <circle
                className="progress"
                cx="60"
                cy="60"
                r="50"
                strokeWidth="10"
                style={{
                  strokeDasharray: 314,
                  strokeDashoffset: 314 - (314 * percentage) / 100,
                }}
              />
            </svg>
            <div className="loannumber">
              <h3>{percentage.toFixed(0)}<span>%</span></h3>
            </div>
          </div>
        </div>
        <ul className="data-list">
          <li className="data-item text-silver-v1">
            <span className="data-item-text">Savings Target</span>
            <span className="data-item-value">${summary.totalLoan.toLocaleString()}</span>
          </li>
          <li className="data-item text-silver-v1">
            <span className="data-item-text">Target Reached</span>
            <span className="data-item-value">${summary.totalPaid.toLocaleString()}</span>
          </li>
          <li className="data-item text-silver-v1">
            <span className="data-item-text">Amount Left</span>
            <span className="data-item-value">LKR {summary.amountLeft.toLocaleString()}</span>
          </li>
        </ul>
      </div>

      {/* Modal for adding loan */}
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        contentLabel="Add Loan"
        className="loanmodal"
      >
        <h2>Add Loan</h2>
        <form onSubmit={addLoan}>
          <input 
            type="number" 
            placeholder="Total Amount" 
            value={totalAmount} 
            onChange={(e) => setTotalAmount(e.target.value)} 
            required 
          />
          <input 
            type="number" 
            placeholder="Amount Paid" 
            value={amountPaid} 
            onChange={(e) => setAmountPaid(e.target.value)} 
            required 
          />
          <button type="submit">Add Loan</button>
          <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Loans;
