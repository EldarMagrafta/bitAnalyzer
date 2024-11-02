// src/components/ExpensesCategorySection.js
import React from 'react';
import TransactionList from './TransactionList';
import PieChart from './charts/PieChart';
import '../assets/styles/App.css';

const ExpensesCategorySection = ({title, data, selectedItem, onSliceClick, generateChartData,
                                  transactionFields, identifierKey, className = "" // Default to an empty string if no className is provided
}) => {

  return (
    <div className={`multiple-pie-chart-wrapper ${className}`}>
      {/* TransactionList Wrapper */}
      <div className="transaction-list-wrapper scrollable-transaction-list-wrapper">
        {selectedItem &&
          data.filter((item) => item[identifierKey] === selectedItem)
            .map((itemData, index) => (
              <TransactionList
                key={index}
                description={itemData[identifierKey]}
                amount={itemData.amount}
                transactions={itemData.transactions}
                fields={transactionFields}
              />
            ))}
      </div>

      {/* PieChart */}
      <div className="medium-pie-chart">
        <h2 className="chart-title">{title}</h2>
        <PieChart data={generateChartData()} onSliceClick={onSliceClick} />
      </div>
    </div>
  );
};

export default ExpensesCategorySection;
