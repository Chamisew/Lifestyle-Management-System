import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Import react-modal
import "./Budget.css";
import { iconsImgs } from "../../utils/images";
import axios from "axios";
import Swal from "sweetalert2";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [paymentType, setPaymentType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const budgetTypes = [
    'Salary', 'Earned income', 'Rental income', 'Passive income', 'Capital gains', 'Royalties',
    'Business income', 'Dividend income', 'Interest', 'Pension income', 'Portfolio income',
    'Gifts', 'Government payments', 'Wage', 'Sales of goods', 'Investments',
    'Unemployment Compensation', 'Taxable income', 'Commission', 'Tips', 'Other income'
  ];

  const fetchBudgets = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'You need to be logged in to view budgets.', 'error');
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:5000/budget", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(response.data);
      fetchTotalAmount();
    } catch (error) {
      Swal.fire('Error!', 'Failed to fetch budgets. Please try again.', 'error');
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchTotalAmount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'You need to be logged in to view total amount.', 'error');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/budget/total', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setTotalAmount(response.data.total);
    } catch (error) {
      Swal.fire('Error!', 'Failed to fetch total amount. Please try again.', 'error');
    }
  };

  // Open modal for adding a budget
  const openAddBudgetModal = () => {
    setCurrentBudget(null);
    setPaymentType('');
    setAmount('');
    setDate('');
    setModalIsOpen(true);
  };

  // Open modal for editing a budget
  const openEditBudgetModal = (budget) => {
    setCurrentBudget(budget);
    setPaymentType(budget.paymentType);
    setAmount(budget.amount);
    setDate(new Date(budget.date).toISOString().split('T')[0]);
    setModalIsOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Function to handle form submission
 const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(date);
    const today = new Date();

    // Clear the time part of the date to compare only the date
    today.setHours(0, 0, 0, 0);

    // Validate that the selected date is not in the past
    if (selectedDate > today) {
        Swal.fire('Error', 'The date cannot be set to a past date.', 'error');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire('Error', 'You need to be logged in to add/edit a budget.', 'error');
        return;
    }

    try {
        if (currentBudget) {
            // Update existing budget
            const response = await axios.put(`http://localhost:5000/budget/${currentBudget._id}`, {
                paymentType,
                amount,
                date
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBudgets(budgets.map(budget => budget._id === currentBudget._id ? response.data : budget));
            Swal.fire('Success', 'Budget updated successfully', 'success');
        } else {
            // Add new budget
            const response = await axios.post('http://localhost:5000/budget', {
                paymentType,
                amount,
                date
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBudgets(prevBudgets => [...prevBudgets, response.data]);
            Swal.fire('Success', 'Budget added successfully', 'success');
        }
        fetchTotalAmount();
        closeModal();
    } catch (error) {
        console.error("Error saving budget:", error);
        Swal.fire('Error', 'Failed to save budget', 'error');
    }
};

  // Function to delete a budget
  const deleteBudget = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'You need to be logged in to delete a budget.', 'error');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(budgets.filter(budget => budget._id !== id));
      fetchTotalAmount();
      Swal.fire('Deleted!', 'Budget has been deleted.', 'success');
    } catch (error) {
      console.error("Error deleting budget:", error);
      Swal.fire('Error', 'Failed to delete budget', 'error');
    }
  };
  const today  = new Date().toISOString().split('T')[0];
  return (
    <div className="income">
      <div className="grid-two-item grid-common grid-c4">
        <div className="grid-c-title">
          <h3 className="grid-c-title-text">Income</h3>
          <button className="grid-c-title-icon" onClick={openAddBudgetModal}>
            <img src={iconsImgs.plus} alt="Add Budget" />
          </button>
        </div>
        <div className="grid-c-top text-silver-v1">
          <h2 className="lg-value">Cash</h2>
          <span className="lg-value">LKR {totalAmount}</span>
        </div>
        <div className="grid-c4-content bg-jet budget-container">
          <div className="grid-items budget-scroll">
            {budgets.map((budget) => (
              <div className="grid-item" key={budget._id}>
                <div className="grid-item-l">
                  <div className="icon">
                    <img src={iconsImgs.check} alt="Budget Icon" />
                  </div>
                  <p className="text text-silver-v1">
                    {budget.paymentType} <span>{new Date(budget.date).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="grid-item-r">
                  <span className="text-silver-v1">LKR {budget.amount}</span>
                  <br />
                   
                  <button className="income-edit-button" style={{ color: 'gray', padding: '3px 2px' }} onClick={() => openEditBudgetModal(budget)}>Edit</button>
                  <button className="income-delete-button" style={{ color: 'gray', padding: '3px 2px' }} onClick={() => deleteBudget(budget._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for adding/editing budget */}
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal}
        contentLabel={currentBudget ? "Edit Budget" : "Add Budget"}
      >
        <h2>{currentBudget ? "Edit Budget" : "Add Budget"}</h2>
        <form onSubmit={handleSubmit}>
          <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} required>
            <option value="" disabled>Select income type</option>
            {budgetTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Amount" 
            required 
          />
          <input 
            type="date" 
            max={today}
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Budget;
