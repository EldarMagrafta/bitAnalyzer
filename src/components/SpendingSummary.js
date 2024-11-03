// src/components/SpendingSummary.js

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { differenceInDays, parse, set } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles/App.css";
import MiniTableComponent from "./MiniTableComponent";

const SpendingSummary = ({ transactions }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const expenseTransactions = transactions.filter(
    (txn) => txn["זיכוי/חיוב"] === "חיוב" && txn["סטטוס"] === "ההעברה בוצעה"
  );

  const lastTransactionDate = parse(
    expenseTransactions[expenseTransactions.length - 1]["תאריך"],
    "dd.MM.yy",
    new Date()
  );
  const allTimesStart = set(lastTransactionDate, { month: 0, date: 1 });
  const effectiveStartDate = startDate || allTimesStart;
  const effectiveEndDate = endDate || lastTransactionDate;
  const totalDays = differenceInDays(effectiveEndDate, effectiveStartDate) + 1;

  const filteredTransactions = expenseTransactions.filter((txn) => {
    const txnDate = parse(txn["תאריך"], "dd.MM.yy", new Date());
    return txnDate >= effectiveStartDate && txnDate <= effectiveEndDate;
  });

  const filteredTotal = filteredTransactions.reduce(
    (acc, txn) => acc + parseFloat(txn["סכום"]),
    0
  );

  const avgPerExpense = (
    filteredTransactions.length
      ? filteredTotal / filteredTransactions.length
      : 0
  ).toFixed(2);
  const avgPerDay = (totalDays > 0 ? filteredTotal / totalDays : 0).toFixed(2);
  const avgPerWeek = (
    totalDays > 0 ? filteredTotal / (totalDays / 7) : 0
  ).toFixed(2);
  const avgPerMonth = (
    totalDays > 0 ? filteredTotal / (totalDays / 30) : 0
  ).toFixed(2);

  const handleClearDates = () => {
    setStartDate(allTimesStart);
    setEndDate(lastTransactionDate);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleShowClick = () => {
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
  };

  return (
    <div className="spending-summary">
      <h2>💰 סיכום הוצאות</h2>

      <div className="date-picker-container right-aligned">
        <label className="date-label">בחר טווח תאריכים:</label>
        <div className="date-pickers">
          <DatePicker
            selected={selectedStartDate}
            onChange={(date) => setSelectedStartDate(date)}
            selectsStart
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            placeholderText="מ- "
            dateFormat="dd.MM.yyyy"
          />
          <DatePicker
            selected={selectedEndDate}
            onChange={(date) => setSelectedEndDate(date)}
            selectsEnd
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            minDate={selectedStartDate}
            placeholderText="עד- "
            dateFormat="dd.MM.yyyy"
          />
        </div>
        <div className="button-container">
          <button onClick={handleShowClick}>הצג</button>
          <button onClick={handleClearDates}>נקה</button>
        </div>
      </div>

      <ul>
        <li style={{ fontWeight: "bold", fontSize: "1.3em", marginBottom: "10px" }}>
          סה"כ הוצאות: <span className="amount">₪ {filteredTotal}</span>
        </li>
        <li>
          הוצאה ממוצעת: <span className="amount">₪ {avgPerExpense}</span>
        </li>
        <li>
          ממוצע יומי: <span className="amount">₪ {avgPerDay}</span>
        </li>
        <li>
          ממוצע שבועי: <span className="amount">₪ {avgPerWeek}</span>
        </li>
        <li>
          ממוצע חודשי: <span className="amount">₪ {avgPerMonth}</span>
        </li>
      </ul>

      {/* New Mini Table displaying transactions within the selected date range */}
      <MiniTableComponent data={filteredTransactions} />
    </div>
  );
};

export default SpendingSummary;
