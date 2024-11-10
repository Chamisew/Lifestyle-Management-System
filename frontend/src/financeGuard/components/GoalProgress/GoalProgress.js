import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart';

const GoalProgress = () => {
  const [goal, setGoal] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedGoalsTotal, setCompletedGoalsTotal] = useState(0);

  useEffect(() => {
    const fetchGoalAndIncome = async () => {
      try {
        const { data: goals } = await axios.get('http://localhost:5000/goals', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const latestGoal = goals[goals.length - 1];
        setGoal(latestGoal);

        const completedGoals = goals.filter((goal) => goal.completed);
        const totalCompletedGoalsAmount = completedGoals.reduce((total, goal) => total + goal.amount, 0);
        setCompletedGoalsTotal(totalCompletedGoalsAmount);

        const { data: incomes } = await axios.get('http://localhost:5000/budget', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const totalIncomeAmount = incomes.reduce((total, income) => total + income.amount, 0);
        setTotalIncome(totalIncomeAmount);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load goal and income data.');
        setLoading(false);
      }
    };

    fetchGoalAndIncome();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const progressPercentage = goal ? Math.min(totalIncome / goal.amount, 1) : 0;

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'center', fontFamily: "'Montserrat', sans-serif", marginTop:'100px', marginLeft:"20px",  marginBottom: "30px" }}>
      <h3 style={{ letterSpacing: '6px', textTransform: 'uppercase', fontSize: '1.3rem' }}>Your Latest Income Goal</h3>
      {goal && (
        <>
          <p>Goal Amount: {goal.amount}</p>
          <p>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
          <p>Total Income: {totalIncome}</p>

          {/* Container for GaugeChart */}
          <div >
            <GaugeChart
              id="income-gauge-chart"
              nrOfLevels={10}
              percent={progressPercentage}
              textColor="#000000"
              arcsLength={[0.2, 0.5, 0.3]} 
              colors={['#EB5757', '#FFF500', '#1f7a8c']} 
              needleColor="#464A4F"
              style={{ width: '100%', height: '100%' }} // Rotate gauge to start from 0 degrees
            />
          </div>

          {progressPercentage >= 1 && <p>Congratulations! You've reached your goal!</p>}
        </>
      )}
    </div>
  );
};

export default GoalProgress;
