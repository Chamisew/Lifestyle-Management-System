import React, { useEffect, useState } from 'react';
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import axios from 'axios';

const Incomebytype = () => {
    const [budgetData, setBudgetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBudgetData = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the JWT token from local storage
                const response = await axios.get('http://localhost:5000/budget', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request headers
                    },
                });

                // Aggregate the budget data by paymentType
                const aggregatedData = response.data.reduce((acc, budget) => {
                    const { amount, paymentType } = budget;
                    if (!acc[paymentType]) {
                        acc[paymentType] = { value: 0, name: paymentType };
                    }
                    acc[paymentType].value += amount; // Sum the amounts
                    return acc;
                }, {});

                // Convert the aggregated object into an array for the chart
                const formattedData = Object.values(aggregatedData);
                setBudgetData(formattedData); // Set the formatted budget data
            } catch (error) {
                setError('Error fetching budget data');
                console.error('Error fetching budget data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgetData();
    }, []); // Run once on component mount

    // Define the chart options
    const option = {
        color: [
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#1158E2" },
                { offset: 1, color: "#42B5F2" }
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#BC1FD7" },
                { offset: 1, color: "#7F1DD1" }
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#E8A618" },
                { offset: 1, color: "#EB6B36" }
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#D131BE" },
                { offset: 1, color: "#BF1575" }
            ]),
        ],
        series: [
            {
                name: "Budget Types",
                type: "pie",
                radius: ["60%", "80%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 50,
                    borderColor: "black",
                    borderWidth: 5,
                },
                label: {
                    show: false,
                    position: "center"
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: "bold"
                    }
                },
                data: budgetData, // Use aggregated budget data here
            }
        ]
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <ReactECharts style={{ height: 140, marginTop: "1rem" }} option={option} />
    );
}

export default Incomebytype;
