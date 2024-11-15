// src/components/ExpensesCategorySection.js
import React from "react";
import TransactionList from "./TransactionList";
import PieChart from "./charts/PieChart";
import "../assets/styles/App.css";

const ExpensesCategorySection = ({
  title,
  data,
  selectedItem,
  onSliceClick,
  generateChartData,
  transactionFields,
  identifierKey,
}) => {
  return (
    <div className="pie-list-wrapper">
      <h2 className="chart-title">{title}</h2>
      <PieChart data={generateChartData()} onSliceClick={onSliceClick} />
      {selectedItem &&
        data
          .filter((item) => item[identifierKey] === selectedItem)
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
  );
};

export default ExpensesCategorySection;
