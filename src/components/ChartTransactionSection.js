// src/components/ChartTransactionSection.js
import React from 'react';
import TransactionList from './TransactionList';
import PieChart from './PieChart';
import '../assets/styles/App.css';

const ChartTransactionSection = ({
  title,
  data,
  selectedItem,
  onSliceClick,
  generateChartData,
  transactionFields,
}) => {
  return (
    <div className="chart-transaction-container">
      <div className="transaction-list-wrapper">
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

      <div className="pie-chart-wrapper">
        <h2 className="chart-title">{title}</h2>
        <PieChart data={generateChartData()} onSliceClick={onSliceClick} />
      </div>
    </div>
  );
};

export default ChartTransactionSection;
