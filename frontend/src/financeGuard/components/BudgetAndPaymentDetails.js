import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BudgetAndPaymentDetails.css'; // Import the CSS for styling

const BudgetAndPaymentDetails = () => {
    const [budgetData, setBudgetData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            // Fetching budget data from /budget endpoint
            const fetchBudgetData = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/budget', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setBudgetData(response.data);
                } catch (error) {
                    setError('Error fetching budget data');
                }
            };

            // Fetching payment data
            const fetchPaymentData = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/payments', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setPaymentData(response.data);
                } catch (error) {
                    setError('Error fetching payment data');
                }
            };

            setLoading(true);
            await Promise.all([fetchBudgetData(), fetchPaymentData()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Calculate total budget and total payments
    const totalBudget = budgetData.reduce((total, budget) => total + budget.amount, 0);
    const totalPayments = paymentData.reduce((total, payment) => total + payment.amount, 0);
    const netIncome = totalBudget - totalPayments;

    return (
        <div className='bandp'>
           
        <div className="budget-payment-container">
           
            <div className="table-container">
                <h2>Budget Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Payment Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetData.map((budget) => (
                            <tr key={budget._id}>
                                <td>{budget.paymentType}</td>
                                <td>{budget.amount}</td>
                                <td>{new Date(budget.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="table-container">
                <h2>Payment Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentData.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.description}</td>
                                <td>{payment.amount}</td>
                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default BudgetAndPaymentDetails;
