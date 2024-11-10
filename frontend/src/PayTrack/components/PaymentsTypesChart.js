import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentsTypesChart = ({ data }) => {
  // Modify chart data to use 'type' instead of 'source'
  const chartData = {
    labels: data.map(paymentType => paymentType.type),
    datasets: [
      {
        label: 'Payment Types',
        data: data.map(paymentType => paymentType.amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderColor: '#fff',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div>
      <h3>Payment Types</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default PaymentsTypesChart;
