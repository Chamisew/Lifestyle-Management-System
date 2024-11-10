import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./netincome.css";
import YearlyFinancialOverview from '../YearlyFinancialOverview';
import BudgetAndPaymentDetails from '../BudgetAndPaymentDetails';
import Incomenav from "../../layout/IncomeNav"
import Nav from '../../../components/Nav/Nav';
import Footer from '../../../components/Footer/Footer';
const NetIncome = () => {
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

        <div className="dashboard-container">
            <Nav/>
            <Incomenav />
            <div className="cards-container">
        
        <div className="netcard">
        <h2>Total Budget: {totalBudget.toFixed(2)}</h2> {/* Displaying Total Budget */}
          <div className="progress">
            <div className="progress-bar" style={{ width: '60%' }}></div>
          </div>
        </div>
        <div className="netcard">
        <h2>Total Payments: {totalPayments.toFixed(2)}</h2> {/* Displaying Total Payments */}
          <div className="progress">
            <div className="progress-bar" style={{ width: '60%' }}></div>
          </div>
        </div>
        <div className="netcard">
        <h2>Total Net Income: {netIncome.toFixed(2)}</h2> {/* Displaying Net Income */}
          <div className="progress">
            <div className="progress-bar" style={{ width: '60%' }}></div>
          </div>
        </div>
            </div>

            <div className="bottom-container">
                <div className="sales-report">
                    <YearlyFinancialOverview />
                    <canvas id="salesChart"></canvas>
                </div>
                <div className="chatbox">
                    <div className="messages">
                        <BudgetAndPaymentDetails />
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default NetIncome;
