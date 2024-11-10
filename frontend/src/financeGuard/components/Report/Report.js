import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Report.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report = () => {
  const [monthlyIncomeData, setMonthlyIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyIncome = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token"); // Adjust the key based on how you store the token

        // Set up the config with the Authorization header
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch monthly income data
        const response = await axios.get("http://localhost:5000/budget/monthly-income", config);
        console.log("Monthly Income Response:", response.data);

        // Check if response data is an array
        if (Array.isArray(response.data)) {
          setMonthlyIncomeData(response.data);
        } else {
          console.error("Expected an array, got:", response.data);
          setError("Received unexpected data format");
        }
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching monthly income:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyIncome();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Calculate total income for percentage calculations
  const totalIncome = monthlyIncomeData.reduce((acc, report) => acc + report.total, 0);

  // Prepare data for Chart.js
  const labels = monthlyIncomeData.map((report) => report.month);
  const incomeValues = monthlyIncomeData.map((report) => (report.total / totalIncome) * 100); // Convert to percentage of total income

  // Create dataset for chart
  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Income as Percentage of Total", // This will be hidden
        data: incomeValues, // Percentages based on total income
        backgroundColor: "#1f7a8c", // Dark color (Pumpkin)
        borderColor: "#022b3a", // Dark border color
        borderWidth: 1,
        borderRadius: 10, // Set corner radius for bars
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to grow in height
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set the max value to 100 for percentage
        ticks: {
          callback: function (value) {
            return value + '%'; // Display percentage on Y-axis
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`; // Display percentage in tooltips
          },
        },
      },
    },
  };

  return (
    <div className="grid-c3">
      <div className="grid-c-title">
        
      </div>
      <div className="grid-chart">
        <div className="grid-chart-bar">
          <Bar data={data} options={options} height={300} />
        </div>
      </div>
    </div>
  );
};

export default Report;
