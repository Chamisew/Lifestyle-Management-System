import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal"; // Import the Modal component
import Swal from "sweetalert2"; // Import SweetAlert2
import "./Financial.css";

// Set the app element for accessibility
Modal.setAppElement("#root"); // Ensure this matches your app's root element

const Financial = () => {
  const [loans, setLoans] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal open/close
  const [currentLoan, setCurrentLoan] = useState(null); // State for the loan being edited
  const [totalAmount, setTotalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/loans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` // Include token for authentication
        }
      });
      console.log("Fetched loans:", response.data); // Log fetched loans
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const openEditModal = (loan) => {
    setCurrentLoan(loan);
    setTotalAmount(loan.totalAmount);
    setAmountPaid(loan.amountPaid);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentLoan(null);
    setTotalAmount('');
    setAmountPaid('');
  };

  const handleEditLoan = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const updatedLoan = {
      totalAmount,
      amountPaid,
    };

    try {
      await axios.put(`http://localhost:5000/loans/${currentLoan._id}`, updatedLoan, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      // Use SweetAlert for success notification
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Loan updated successfully!',
      });
      fetchLoans(); // Refresh the loan list
      closeModal(); // Close modal after updating
    } catch (error) {
      console.error("Error updating loan:", error);
      // Use SweetAlert for error notification
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the loan.',
      });
    }
  };

  const deleteLoan = async (loanId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/loans/${loanId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        // Use SweetAlert for success notification
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your loan has been deleted.',
        });
        fetchLoans(); // Refresh the loan list
      } catch (error) {
        console.error("Error deleting loan:", error);
        // Use SweetAlert for error notification
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error deleting the loan.',
        });
      }
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  

  return (
    <div className="subgrid-two-item grid-common grid-c8">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Loans details</h3>
      </div>
      <div className="grid-c8-content">
        <div className="loan-list">
          {loans.length > 0 ? (
            loans.map((loan) => (
              <div key={loan._id} className="loan-item">
                <p>Total Amount: ${loan.totalAmount}</p>
                <p>Amount Paid: ${loan.amountPaid}</p>
                <button className="lone-edit-button" onClick={() => openEditModal(loan)}>Edit</button>
                <button className="lone-delete-button" onClick={() => deleteLoan(loan._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No loans available.</p>
          )}
        </div>
      </div>

      {/* Modal for editing loan */}
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        contentLabel="Edit Loan"
        className="modal" // You can add your custom styles here
      >
        <h2>Edit Loan</h2>
        <form onSubmit={handleEditLoan}>
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
          <button type="submit">Update Loan</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Financial;
