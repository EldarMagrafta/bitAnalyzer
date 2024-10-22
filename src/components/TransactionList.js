import React from 'react';
import Transaction from './Transaction';
import '../assets/styles/App.css';

const TransactionList = ({ description, amount, transactions }) => {
  return (
    <div className="transaction-list-container">
      <h3 className="transaction-list-title">
        {description} - {amount.toFixed(2)+"₪"}
      </h3>
      <div className="transaction-list">
        {transactions.map((transaction, index) => (
          <Transaction key={index} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
