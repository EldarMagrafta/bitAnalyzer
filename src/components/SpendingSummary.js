// src/components/SpendingSummary.js

import React from "react";
import { differenceInDays, parse, set } from "date-fns";

const SpendingSummary = ({ transactions }) => {
  // Filter transactions to include only 'חיוב' (debits/expenses)
  const expenseTransactions = transactions.filter(
    (txn) => txn["זיכוי/חיוב"] === "חיוב"
  );

  if (expenseTransactions.length === 0) {
    return <p>No expense transactions available.</p>;
  }

  // Calculate the total amount spent on expenses
  let totalAmount = 0;
  expenseTransactions.forEach((txn) => {
    totalAmount += parseFloat(txn["סכום"]) || 0; // Handle non-numeric amounts gracefully
  });

  // Parse the date of the last transaction
  const lastDate = parse(
    expenseTransactions[expenseTransactions.length - 1]["תאריך"],
    "dd.MM.yy",
    new Date()
  );

  // Set firstDate to January 1st of the same year as lastDate
  const firstDate = set(lastDate, { month: 0, date: 1 }); // January 1st

  const totalDays = differenceInDays(lastDate, firstDate) + 1; // Include both start and end dates

  // Calculate the average amount per expense
  const avgPerExpense = (totalAmount / expenseTransactions.length).toFixed(2);

  // Calculate average spending per day, week, and month
  const avgPerDay = (totalDays > 0 ? totalAmount / totalDays : 0).toFixed(2);
  const avgPerWeek = (totalDays > 0 ? totalAmount / (totalDays / 7) : 0).toFixed(2);
  const avgPerMonth = (totalDays > 0 ? totalAmount / (totalDays / 30) : 0).toFixed(2);

  return (
    <div className="spending-summary">
      <h2>Spending Summary</h2>
      <ul>
        <li>Average per expense: ₪ {avgPerExpense}</li>
        <li>Average per day: ₪ {avgPerDay}</li>
        <li>Average per week: ₪ {avgPerWeek}</li>
        <li>Average per month: ₪ {avgPerMonth}</li>
      </ul>
    </div>
  );
};

export default SpendingSummary;
