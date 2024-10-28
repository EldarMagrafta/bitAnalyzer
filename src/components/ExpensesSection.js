// src/components/ExpensesSection.js
import React from 'react';
import TransactionList from './TransactionList';
import PieChart from './PieChart';
import '../assets/styles/App.css'; // Adjust the path if necessary

const ExpensesSection = ({
  title,
  data,
  selectedItem,
  onSliceClick,
  generateChartData,
  transactionFields,
}) => {
  return (
    <div className="multiple-pie-chart-wrapper">
      {/* TransactionList Wrapper */}
      <div className="transaction-list-wrapper scrollable-transaction-list-wrapper">
        {selectedItem &&
          data
            .filter((item) => item.identifier === selectedItem)
            .map((itemData, index) => (
              <TransactionList
                key={index}
                description={itemData.identifier}
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

export default ExpensesSection;
