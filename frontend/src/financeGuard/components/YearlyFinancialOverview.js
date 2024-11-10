import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const IncomeLineChart = () => {
    const [incomeData, setIncomeData] = useState([]);
    const [paymentData, setPaymentData] = useState(Array(12).fill(0)); // Initialize with zeros for 12 months
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            const fetchIncomeData = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/budget/monthly-income', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const monthlyIncome = response.data.map(item => item.total);
                    setIncomeData(monthlyIncome);
                } catch (error) {
                    setError('Error fetching income data');
                }
            };

            const fetchPaymentData = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/payments', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const payments = response.data;

                    // Aggregate payments by month
                    const monthlyPayments = Array(12).fill(0);
                    payments.forEach(payment => {
                        const paymentDate = new Date(payment.date);
                        const month = paymentDate.getMonth(); // Get month index (0-11)
                        monthlyPayments[month] += payment.amount; // Sum up the amounts for each month
                    });
                    setPaymentData(monthlyPayments);
                } catch (error) {
                    setError('Error fetching payment data');
                }
            };

            setLoading(true);
            await Promise.all([fetchIncomeData(), fetchPaymentData()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const filledIncomeData = [...incomeData, ...Array(12 - incomeData.length).fill(0)];
    const filledPaymentData = [...paymentData, ...Array(12 - paymentData.length).fill(0)];

    const option = {
        color: ['#bfdbf7', '#1f7a8c'],
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            backgroundColor: 'rgba(0, 0, 0, 0.59)',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yAxis: {
            type: 'value',
            splitLine: { show: false },
        },
        series: [
            {
                name: 'Income',
                type: 'line',
                smooth: true,
                data: filledIncomeData,
            },
            {
                name: 'Payments',
                type: 'line',
                smooth: true,
                data: filledPaymentData,
            },
        ],
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return <ReactECharts option={option} />;
};

export default IncomeLineChart;
