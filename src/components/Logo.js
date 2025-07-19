import React from 'react';

const Logo = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <svg width="80" height="80" viewBox="0 0 100 100" fill="gold">
        <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="2" />
        <text x="50%" y="55%" textAnchor="middle" fill="black" fontSize="28px" fontWeight="bold" fontFamily="Arial">
          ₹
        </text>
      </svg>
    </div>
  );
};

export default Logo;
