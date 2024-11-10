import React from 'react';

function WelcomeAutoAssist() {
  return (
    <div>
      <p style={{ 
          fontSize: '16px', 
          lineHeight: '3', 
          fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace" ,
           textTransform: 'uppercase',  // Make text uppercase
          letterSpacing: '1px',
          textAlign: 'center', // Center alignment
          margin: '20px 40px',
        }}>
    Welcome to Lifestyle Planner! Log in to access your personalized dashboard, where you can manage your daily routines, track your health, and stay organized with ease. With our intuitive tools, you can set goals, track your progress, and stay on top of all your commitments. From managing work tasks to balancing your personal life, Lifestyle Planner empowers you to create structure in your day.

Whether you're focusing on fitness, meal planning, or simply keeping up with appointments, we make it easy to stay organized. Prioritize your well-being with our built-in health tracker and reminder system, ensuring you never miss an important task or milestone.

Let’s continue your journey towards a balanced and fulfilling lifestyle. Your goals are just a click away—let us help you achieve them every step of the way!
      </p>
    </div>
  );
}

export default WelcomeAutoAssist;
