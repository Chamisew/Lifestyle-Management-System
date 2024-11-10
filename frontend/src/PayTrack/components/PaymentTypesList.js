import React from 'react';
import './PaymentTypesList.css'; // Ensure this CSS file is created and styled

const icons = {
  'Construction': '🏗️',
  'Education services': '🎓',
  'Employee compensation': '💼',
  'Exports (of goods)': '📦',
  'Financial services': '💰',
  'Gifts and donations': '🎁',
  'Hardware consultancy': '💻',
  'Health services': '🏥',
  'Insurance and pension services': '🛡️',
  'Intellectual property': '📚',
  'Investment banking': '🏦',
  'Manufacturing - goods': '🏭',
  'Other business services': '📊',
  'Other insurance': '🔒',
  'Recreational services': '🎢',
  'Tax': '💸',
  'Telecommunication, computer': '📞',
  'Travel': '🌍',
  'Family support': '👪',
  'Donations': '🤲',
  'Educational support': '📖',
};

const PaymentTypesList = ({ data }) => {
  return (
    <div className="payment-types-list">
      {data.map((item) => (
        <div key={item.type} className="payment-type-item">
          <div className="payment-type-icon">{icons[item.type] || '🔘'}</div>
          <div className="payment-type-info">
            <p className="payment-type-name">{item.type}</p>
            <p className="payment-type-amount">LKR {item.amount.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentTypesList;
