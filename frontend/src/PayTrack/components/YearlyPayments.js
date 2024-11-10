import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom';
import PaymentsTypesChart from './PaymentsTypesChart';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const YearlyPayments = () => {
  const [paymentData, setPaymentData] = useState({
    labels: [],
    datasets: []
  });

  const [paymentTypesData, setPaymentTypesData] = useState([]);
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    const fetchPaymentData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      try {
        const { data } = await axios.get('/api/payments', config);

        if (data) {
          const thisYear = new Date().getFullYear();
          const nextYear = thisYear + 1;

          const paymentsByMonthThisYear = Array(12).fill(0);
          const paymentsByMonthnextYear = Array(12).fill(0);

          data.forEach(payment => {
            const date = new Date(payment.date);
            const month = date.getMonth();
            const year = date.getFullYear();

            if (year === thisYear) {
              paymentsByMonthThisYear[month] += payment.amount;
            } else if (year === nextYear) {
              paymentsByMonthnextYear[month] += payment.amount;
            }
          });

          const months = [
            'J', 'F', 'M', 'A', 'M', 'J',
            'J', 'A', 'S', 'O', 'N', 'D'
          ];

          setPaymentData({
            labels: months,
            datasets: [
              {
                label: `${thisYear}`,
                data: paymentsByMonthThisYear,
                borderColor: '#007BFF',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true,
                borderWidth: 1,
                pointBorderColor: '#007BFF',
                pointBackgroundColor: '#007BFF',
                pointBorderWidth: 2,
                pointRadius: 3,
                tension: 0.1,
              },
              {
                label: `${nextYear}`,
                data: paymentsByMonthnextYear,
                borderColor: '#FF5733',
                backgroundColor: 'rgba(255, 87, 51, 0.2)',
                fill: true,
                borderWidth: 1,
                pointBorderColor: '#FF5733',
                pointBackgroundColor: '#FF5733',
                pointBorderWidth: 2,
                pointRadius: 3,
                tension: 0.1,
              },
            ],
          });

          const paymentsByType = {};

          data.forEach(payment => {
            const type = payment.type;

            if (!paymentsByType[type]) {
              paymentsByType[type] = 0;
            }

            paymentsByType[type] += payment.amount;
          });

          const formattedData = Object.entries(paymentsByType).map(([type, amount]) => ({
            type,
            amount
          }));

          setPaymentTypesData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };

    fetchPaymentData();
  }, []);

  const togglePaymentTypesChart = () => {
    setIsChartVisible(!isChartVisible);

    if (!isChartVisible) {
      Swal.fire({
        html: `<div id="paymentTypesChartContainer"></div>`,
        customClass: {
          popup: 'swal-custom-popup',
        },
        didOpen: () => {
          const container = document.getElementById('paymentTypesChartContainer');
          if (container) {
            ReactDOM.render(<PaymentsTypesChart data={paymentTypesData} />, container);
          }
        },
        willClose: () => {
          setIsChartVisible(false);
        }
      });
    } else {
      Swal.close();
    }
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', position: 'relative' }}>
      <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={isChartVisible}
          onChange={togglePaymentTypesChart}
          style={{ display: 'none' }}
        />
        <span
          style={{
            position: 'relative',
            cursor: 'pointer',
            width: '34px',
            height: '20px',
            backgroundColor: isChartVisible ? '#007BFF' : '#ccc',
            borderRadius: '20px',
            transition: '.4s',
            display: 'inline-block',
          }}
        >
          <span
            style={{
              position: 'absolute',
              content: '""',
              height: '12px',
              width: '12px',
              borderRadius: '50%',
              backgroundColor: 'white',
              transition: '.4s',
              left: isChartVisible ? '14px' : '4px',
              bottom: '4px',
            }}
          ></span>
        </span>
      </label>

      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
        Yearly Payments Chart
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Line
            data={paymentData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Month',
                    color: 'black',
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
                    color: 'black',
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
              },
              plugins: {
                legend: {
                  position: 'top',
                  align: 'start',
                  labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    color: 'black',
                    padding: 10,
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
    </div>
  );
};

export default YearlyPayments;
