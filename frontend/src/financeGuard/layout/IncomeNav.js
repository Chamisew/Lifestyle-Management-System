import React from 'react';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      background: 'linear-gradient(to right, #022b3a, #1f7a8c)',
      padding: '15px 0',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: '0',
      zIndex: '1000',
    }}>
      <div style={{
        fontSize: '24px',
        color: '#1f7a8c',
        fontWeight: 'bold',
      }}>
       FinanceGuard
      </div>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        margin: '0',
        padding: '0',
      }}>
        <li style={{
          margin: '0 15px',
        }}>
          <a href="/allincome" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: '18px',
            transition: 'color 0.3s ease',
          }} onMouseOver={e => e.currentTarget.style.color = '#BFDBF7'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
            Dashboard
          </a>
        </li>
        <li style={{
          margin: '0 15px',
        }}>
          <a href="/incomecalendar" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: '18px',
            transition: 'color 0.3s ease',
          }} onMouseOver={e => e.currentTarget.style.color = '#BFDBF7'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
            Calendar
          </a>
        </li>
        <li style={{
          margin: '0 15px',
        }}>
          <a href="/netincome" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: '18px',
            transition: 'color 0.3s ease',
          }} onMouseOver={e => e.currentTarget.style.color = '#BFDBF7'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
            Income VS Payment
          </a>
        </li>
        <li style={{
          margin: '0 15px',
        }}>
          <a href="/login" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: '18px',
            transition: 'color 0.3s ease',
          }} onMouseOver={e => e.currentTarget.style.color = '#FF0000'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
