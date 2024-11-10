import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../assets/icons/logo.jpeg'; // Adjust the path as necessary

const StatisticsChart = () => {
    const [incomeData, setIncomeData] = useState([]);
    const [budgets, setBudgets] = useState([]); // State for budgets
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the JWT token from local storage
                const incomeResponse = await axios.get('http://localhost:5000/budget/monthly-income', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request headers
                    },
                });
                const monthlyIncome = incomeResponse.data.map(item => item.total); // Map to an array of total incomes
                setIncomeData(monthlyIncome);

                // Fetch budgets
                const budgetsResponse = await axios.get('http://localhost:5000/budget', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request headers
                    },
                });
                setBudgets(budgetsResponse.data); // Set budgets data
            } catch (error) {
                setError('Error fetching income data');
                console.error('Error fetching income data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIncomeData();
    }, []); // Run once on component mount

    const option = {
        color: ['var(--orange)'],
        toolbox: {
            feature: {
                saveAsImage: {},
                myTool: {
                    show: true,
                    title: 'View Budgets',
                    icon: 'path://M8,8V2H3C1.3,2,0,3.3,0,5v5c0,1.7,1.3,3,3,3h5c1.7,0,3-1.3,3-3V8H8z M8,10h3v3H3v-3h5V10z',
                    onclick: () => handleViewBudgets(), // Call function to handle viewing budgets
                },
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
            },
            backgroundColor: 'rgba(0, 0, 0, 0.59)',
            borderWidth: 0,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
            show: false,
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Monthly labels
            },
        ],
        yAxis: [
            {
                type: 'value',
                splitLine: {
                    show: false,
                },
            },
        ],
        series: [
            {
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: "rgb(255, 191, 0)",
                        },
                        {
                            offset: 1,
                             color: "#F450D3"
                        },
                    ]),
                    width: 4,
                },
                areaStyle: {
                    opacity: 0.5,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [
                        {
                            offset: 0,
                            color: "#FE4C00"
                        },
                        {
                            offset: 1,
                            color: 'rgba(255, 144, 70, 0.1)',
                        },
                    ]),
                },
                emphasis: {
                    focus: 'series',
                },
                showSymbol: false,
                data: incomeData,
            },
        ],
    };

    const handleViewBudgets = () => {
        const budgetRows = budgets.map(budget => [budget.paymentType, `LKR ${budget.amount}`, new Date(budget.date).toLocaleDateString()]);

        Swal.fire({
            title: 'All Budgets',
            html: `
                <div style="overflow-x:auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <th style="border: 1px solid black; padding: 8px;">Payment Type</th>
                            <th style="border: 1px solid black; padding: 8px;">Amount</th>
                            <th style="border: 1px solid black; padding: 8px;">Date</th>
                        </tr>
                        ${budgetRows.map(row => `
                            <tr>
                                <td style="border: 1px solid black; padding: 8px;">${row[0]}</td>
                                <td style="border: 1px solid black; padding: 8px;">${row[1]}</td>
                                <td style="border: 1px solid black; padding: 8px;">${row[2]}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Download PDF',
            cancelButtonText: 'Close',
            preConfirm: () => {
                downloadPDF();
            },
        });
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
    
        // Add logo at the top
        doc.addImage(logo, 'PNG', 10, 10, 50, 20); // Adjust x, y, width, and height as needed
    
        // Add title
        doc.text("Budget Report", 14, 40);
    
        // Create the table
        doc.autoTable({
            head: [['Payment Type', 'Amount', 'Date']],
            body: budgets.map(budget => [
                budget.paymentType,
                `LKR ${budget.amount}`,
                new Date(budget.date).toLocaleDateString()
            ]),
            startY: 45, // Start below the title
        });
    
        // Get current date
        const currentDate = new Date().toLocaleDateString();
    
        // Add company email and current date at the bottom with reduced font size
        const email = "company@example.com"; // Replace with your company email
        doc.setFontSize(5); // Set font size for email and date
        doc.text(`Email: ${email}`, 10, doc.internal.pageSize.height - 20);
        doc.text(`Date: ${currentDate}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 20); // Adjust x position as needed
    
        // Save the PDF
        doc.save('budget-report.pdf');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ backgroundColor: '#022b3a', padding: '20px', borderRadius: '8px' }}>
            <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
        </div>
    );
};

export default StatisticsChart;
