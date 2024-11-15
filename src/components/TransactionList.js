import React from "react";
import Transaction from "./Transaction";
import "../assets/styles/App.css";

const TransactionList = ({ description, amount, transactions, fields }) => {
  return (
    <div className="transaction-list">
      <h3 className="transaction-list-title">
        {description} - {amount.toFixed(2) + "₪"}
      </h3>

      {transactions.map((transaction, index) => (
        <Transaction key={index} transaction={transaction} fields={fields} />
      ))}
    </div>
  );
};

export default TransactionList;
