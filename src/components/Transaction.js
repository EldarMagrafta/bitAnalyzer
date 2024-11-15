// src/components/Transaction.js
import React from 'react';
import '../assets/styles/App.css'; // Ensure the correct path to the CSS file

const Transaction = ({transaction, fields}) => {
    return (
        <div className="transaction-container">
            {fields.map((field, index) => (
                <React.Fragment key={index}>
                    <span className="transaction-item">{transaction[field]}</span>
                    {index < fields.length - 1 && (
                        <span>|</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Transaction;
