import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa'; 
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import "./ViewExpenses.css";

const ViewExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage
                const response = await axios.get('http://localhost:5000/api/expenses', {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the headers
                    }
                });
                setExpenses(response.data);
            } catch (err) {
                setError('Error fetching expenses');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch expenses. Please try again later.',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const handleDelete = async (expenseId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the headers
                    }
                });
                setExpenses(expenses.filter(exp => exp._id !== expenseId));
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The expense has been deleted.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (err) {
            setError('Error deleting expense');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete expense. Please try again later.',
                confirmButtonText: 'OK'
            });
        }
    };

    const calculateTotalPerBudget = (filtered) => {
        const budgetTotals = {};
        filtered.forEach(expense => {
            if (!budgetTotals[expense.budgetName]) {
                budgetTotals[expense.budgetName] = 0;
            }
            expense.expenses.forEach(exp => {
                budgetTotals[expense.budgetName] += exp.amount;
            });
        });
        return budgetTotals;
    };

    const groupExpensesByBudget = (filtered) => {
        const grouped = {};
        filtered.forEach(expense => {
            if (!grouped[expense.budgetName]) {
                grouped[expense.budgetName] = [];
            }
            grouped[expense.budgetName].push(expense);
        });
        return grouped;
    };

    const filteredExpenses = expenses.filter(expense =>
        expense.expenses.some(exp => exp.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        expense.budgetName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const groupedExpenses = groupExpensesByBudget(filteredExpenses);
    const budgetTotals = calculateTotalPerBudget(filteredExpenses);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="viewexpenses-conta">
        <Nav/>
                <div className="viewexpenses-container">
                  
                    <h1 className="viewexpenses-title">All Expenses</h1>
                    <div className='expenses-search'>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="expenses-search-input"
                        />
                        <FaSearch className="expenses-search-icon"/> 
                    </div>
                    <table className="viewexpenses-table">
                        <thead>
                            <tr className="viewexpenses-header-row">
                                <th className="viewexpenses-header">Budget Name</th>
                                <th className="viewexpenses-header">Expense Name</th>
                                <th className="viewexpenses-header">Amount (Rs.)</th>
                                <th className="viewexpenses-header">Total (Rs.)</th>
                                <th className="viewexpenses-header">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupedExpenses).map(([budgetName, budgetExpenses]) => (
                                <React.Fragment key={budgetName}>
                                    {budgetExpenses.map((expense, expIndex) => (
                                        <React.Fragment key={expense._id}>
                                            {expense.expenses.map((exp, expSubIndex) => (
                                                <tr className="viewexpenses-row" key={expSubIndex}>
                                                    {expIndex === 0 && expSubIndex === 0 && (
                                                        <td
                                                            className="viewexpenses-budget-name"
                                                            rowSpan={budgetExpenses.reduce((sum, exp) => sum + exp.expenses.length, 0)}
                                                        >
                                                            {budgetName}
                                                        </td>
                                                    )}
                                                    <td className="viewexpenses-expense-name">{exp.name || '-'}</td>
                                                    <td className="viewexpenses-amount">{exp.amount || '-'}</td>
                                                    {expIndex === 0 && expSubIndex === 0 && (
                                                        <>
                                                            <td
                                                                className="viewexpenses-total"
                                                                rowSpan={budgetExpenses.reduce((sum, exp) => sum + exp.expenses.length, 0)}
                                                            >
                                                                <strong>{budgetTotals[budgetName]}</strong>
                                                            </td>
                                                            <td
                                                                className="viewexpenses-actions"
                                                                rowSpan={budgetExpenses.reduce((sum, exp) => sum + exp.expenses.length, 0)}
                                                            >
                                                                <FaTrash
                                                                    className="viewexpenses-delete-icon"
                                                                    onClick={() => handleDelete(expense._id)}
                                                                />
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    <Footer/>
                </div>
      
    );
};

export default ViewExpenses;
