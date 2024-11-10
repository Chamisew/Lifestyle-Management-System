import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyPaymentsChart = () => {
  const [monthlyPaymentData, setMonthlyPaymentData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchMonthlyPayments = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      try {
        const { data } = await axios.get('/api/payments', config);

        if (data) {
          const thisYear = new Date().getFullYear();
          const paymentsByMonthThisYear = Array(12).fill(0);

          data.forEach(payment => {
            const date = new Date(payment.date);
            const month = date.getMonth();
            const year = date.getFullYear();

            if (year === thisYear) {
              paymentsByMonthThisYear[month] += payment.amount;
            }
          });

          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];

          setMonthlyPaymentData({
            labels: months,
            datasets: [
              {
                label: `${thisYear} Payments`,
                data: paymentsByMonthThisYear,
                backgroundColor: '#4caf50',
                borderColor: '#4caf50',
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching monthly payment data:', error);
      }
    };

    fetchMonthlyPayments();
  }, []);

  return (
    <div style={{
      marginTop: '2rem',
      padding: '1rem',
      borderRadius: '8px',
    }}>
      <p style={{
        fontSize: '10px',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#333',
      }}>Monthly Payments Bar Chart</p>
      <div style={{
        position: 'relative',
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <Bar
          data={monthlyPaymentData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Month',
                  color: 'black'
                },
                grid: {
                  display: false,
                },
                ticks: {
                  color: 'black',
                  font: {
                    family: 'Montserrat',
                  },
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Amount',
                  color: 'black'
                },
                grid: {
                  display: false,
                },
                ticks: {
                  color: 'black',
                  font: {
                    family: 'Montserrat',
                  },
                },
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: 'black',
                  font: {
                    family: 'Montserrat',
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MonthlyPaymentsChart;
