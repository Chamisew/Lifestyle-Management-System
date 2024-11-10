import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaymentTypesList from './PaymentTypesList'; // Import the PaymentTypesList component

const PamentBytepe = () => {
  const [paymentTypesData, setPaymentTypesData] = useState([]);

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

  return (
    <div className="some-component">
      <PaymentTypesList data={paymentTypesData} />
    </div>
  );
};

export default PamentBytepe;
