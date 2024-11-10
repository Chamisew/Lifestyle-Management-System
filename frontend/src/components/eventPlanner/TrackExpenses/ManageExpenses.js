import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import logo from '../../../MEETIMAGES/Household lifestyle partner-01-01.png';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import './ManageExpenses.css';

function ManageExpenses() {
  const [budgetName, setBudgetName] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [total, setTotal] = useState(0);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated and retrieve token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      Swal.fire('Error!', 'Please log in to access this feature.', 'error');
    }
  }, []);

  const handleAddOrEditExpense = () => {
    if (expenseName && expenseAmount) {
      const updatedExpenses = [...expenses];
      const newExpense = { name: expenseName, amount: parseFloat(expenseAmount) };

      if (editIndex !== null) {
        updatedExpenses[editIndex] = newExpense;
        setEditIndex(null);
      } else {
        updatedExpenses.push(newExpense);
      }

      setExpenses(updatedExpenses);
      setExpenseName('');
      setExpenseAmount('');
      calculateTotal(updatedExpenses);
    } else {
      Swal.fire('Error!', 'Please enter both name and amount.', 'error');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setExpenseName(expenses[index].name);
    setExpenseAmount(expenses[index].amount);
  };

  const handleDelete = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(updatedExpenses);
        calculateTotal(updatedExpenses);
        Swal.fire('Deleted!', 'Your expense has been deleted.', 'success');
      }
    });
  };

  const calculateTotal = (expenseList) => {
    const totalAmount = expenseList.reduce((acc, expense) => acc + expense.amount, 0);
    setTotal(totalAmount);
  };

  const handleSave = async () => {
    if (!token) {
      Swal.fire('Error!', 'Please log in to save expenses.', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/expenses', { budgetName, expenses }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire('Saved!', 'Your expenses have been saved successfully!', 'success');
    } catch (error) {
      Swal.fire('Error!', 'There was an error saving your expenses.', 'error');
      console.error('Error saving expenses:', error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add logo to the PDF
    doc.addImage(logo, 'PNG', 10, 10, 20, 20); // Adjust logo dimensions and position as needed

    // Set document font size and add the title
    doc.setFontSize(16);
    doc.text(`Budget List for: ${budgetName || 'No budget'}`, 14, 35);

    // Add date and time generated
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    doc.setFontSize(12);
    doc.text(`Date Generated: ${formattedDate}`, 14, 45);
    doc.text(`Time Generated: ${formattedTime}`, 120, 45);

    // Define table columns and rows
    const tableColumn = ['Expense Name', 'Amount (Rs.)'];
    const tableRows = expenses.map((expense) => [
      expense.name,
      expense.amount.toFixed(2),
    ]);

    // Add total to table rows
    tableRows.push(['Total', total.toFixed(2)]);

    // Create table for expenses
    doc.autoTable({
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      styles: { cellPadding: 5, fontSize: 12 },
      theme: 'grid',
    });

    // Save the PDF
    doc.save(`${budgetName}_Budget_List.pdf`);
    Swal.fire('Downloaded!', 'Your PDF has been downloaded.', 'success');
  };

  return (
    <div className="addexpenses-cont">
    <Nav/>
        <div className="addexpenses-container">
         
          <h1 className="addexpenses-title">Manage Event Expenses</h1>

          <label className="addexpenses-label">
            Budget Name:
            <input
              className="addexpenses-input"
              type="text"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
            />
          </label>

          <div className="addexpenses-expenses-container">
            <h2 className="addexpenses-expenses-title">Expenses</h2>

            <input
              className="addexpenses-input"
              type="text"
              placeholder="Expense Name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />

            <input
              className="addexpenses-input"
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />

            <button className="addexpenses-button" onClick={handleAddOrEditExpense}>
              {editIndex !== null ? 'Update Expense' : 'Add Expense'}
            </button>

            <ul className="addexpenses-list">
              {expenses.map((expense, index) => (
                <li className="addexpenses-list-item" key={index}>
                  <span className="addexpenses-expense-name">{expense.name}</span>
                  <span className="addexpenses-expense-amount">Rs.{expense.amount.toFixed(2)}</span>
                  <div className="addexpenses-icons-container">
                    <FaEdit className="addexpenses-edit-icon" onClick={() => handleEdit(index)} />
                    <FaTrash className="addexpenses-delete-icon" onClick={() => handleDelete(index)} />
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="addexpenses-total">TOTAL: Rs.{total.toFixed(2)}</h3>
          </div>

          <div className="addexpenses-buttons-container">
            <button className="addexpenses-save-button" onClick={handleSave}>Save</button>
            <button className="addexpenses-download-button" onClick={handleDownloadPDF}>Download</button><br />
          </div>

          <button className="addexpenses-shopping-button">To Manage Shopping</button>
        </div>
  <Footer/>
  </div>
  );
}

export default ManageExpenses;
