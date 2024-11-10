import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './IncomeBySource.css'; // Import external CSS

const IncomeBySource = () => {
  const [incomeData, setIncomeData] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };

        const { data } = await axios.get('http://localhost:5000/budget', config);

        if (data) {
          const incomeBySource = {};
          let total = 0;

          data.forEach(income => {
            const paymentType = income.paymentType;
            if (!incomeBySource[paymentType]) {
              incomeBySource[paymentType] = 0;
            }
            incomeBySource[paymentType] += income.amount;
            total += income.amount;
          });

          setIncomeData(incomeBySource);
          setTotalIncome(total);
        }
      } catch (error) {
        console.error('Error fetching income data:', error);
        setError('Failed to load income data.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="income-container">
      <div className="income-content">
        {Object.keys(incomeData).map((paymentType, index) => {
          const amount = incomeData[paymentType];
          const percentage = (amount / totalIncome) * 100 || 0;

          return (
            <div key={paymentType} className="income-card">
              <h4 className="income-title">{paymentType}</h4>
              <div className="income-progressbar">
                <CircularProgressbar
                  value={percentage}
                  text={`${Math.floor(percentage)}%`}
                  styles={buildStyles({
                    rotation: 0.75,
                    strokeLinecap: 'round',
                    pathColor: `#${(index * 50).toString(16)}FF`, // Dynamic color for each source
                    textColor: '#4C4C66',
                    trailColor: '#e1e5f2',
                    textSize: '12px',
                  })}
                />
                <p className="income-amount">LKR {amount.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeBySource;
