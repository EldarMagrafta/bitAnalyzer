// src/components/Transaction.js
import React from 'react';
import '../assets/styles/App.css'; // Ensure the correct path to the CSS file

const Transaction = ({ transaction }) => {
  const { date, amount, person } = transaction;

  return (
    <div className="transaction-container">
      <span className="transaction-item">{date}</span>
      <span className="transaction-separator">|</span>
      <span className="transaction-item">{amount}</span>
      <span className="transaction-separator">|</span>
      <span className="transaction-item">{person}</span>
    </div>
  );
};

export default Transaction;
