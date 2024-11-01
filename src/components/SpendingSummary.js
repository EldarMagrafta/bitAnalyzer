// src/components/SpendingSummary.js

import React from "react";
import { differenceInDays, parse, set } from "date-fns";
import '../assets/styles/App.css';

const SpendingSummary = ({ transactions }) => {
  const expenseTransactions = transactions.filter(
    (txn) => txn["זיכוי/חיוב"] === "חיוב"
  );

  if (expenseTransactions.length === 0) {
    return <p>No expense transactions available.</p>;
  }

  let totalAmount = 0;
  expenseTransactions.forEach((txn) => {
    totalAmount += parseFloat(txn["סכום"]) || 0;
  });

  const lastDate = parse(
    expenseTransactions[expenseTransactions.length - 1]["תאריך"],
    "dd.MM.yy",
    new Date()
  );
  const firstDate = set(lastDate, { month: 0, date: 1 });
  const totalDays = differenceInDays(lastDate, firstDate) + 1;

  const avgPerExpense = (totalAmount / expenseTransactions.length).toFixed(2);
  const avgPerDay = (totalDays > 0 ? totalAmount / totalDays : 0).toFixed(2);
  const avgPerWeek = (
    totalDays > 0 ? totalAmount / (totalDays / 7) : 0
  ).toFixed(2);
  const avgPerMonth = (
    totalDays > 0 ? totalAmount / (totalDays / 30) : 0
  ).toFixed(2);

  return (
    <div className="spending-summary">
      <h2>סיכום הוצאות</h2>
      <ul>
        <li>ממוצע להוצאה: <span className="amount">₪ {avgPerExpense}</span></li>
        <li>ממוצע ליום: <span className="amount">₪ {avgPerDay}</span></li>
        <li>ממוצע לשבוע: <span className="amount">₪ {avgPerWeek}</span></li>
        <li>ממוצע לחודש: <span className="amount">₪ {avgPerMonth}</span></li>
      </ul>
    </div>
  );
};

export default SpendingSummary;
