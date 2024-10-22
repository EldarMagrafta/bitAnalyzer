// src/pages/CsvReader.js
import React, { useState } from 'react';
import Papa from 'papaparse';
import PieChart from '../components/PieChart';
import TableComponent from '../components/TableComponent';
import FileInput from '../components/FileInput';
import ToggleTableButton from '../components/ToggleTableButton';
import TransactionList from '../components/TransactionList';
import '../assets/styles/App.css';

const CsvReader = () => {
  const [data, setData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [file, setFile] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [selectedDescription, setSelectedDescription] = useState(null); // Track selected description

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAnalyze = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: processCsvData,
      });
    } else {
      alert("Please select a file before analyzing.");
    }
  };

  const processCsvData = (result) => {
    const headers = result.meta.fields.filter((header) => header.trim() !== "");
    const cleanedData = result.data
      .map((row) => {
        const cleanedRow = {};
        headers.forEach((header) => {
          cleanedRow[header] = row[header];
        });
        return cleanedRow;
      })
      .filter((row) => {
        return Object.values(row).some(
          (value) => value && value.toString().trim() !== ""
        );
      });

    setData(cleanedData);
    const { aggregatedExpenses, aggregatedIncomes } = generateAggregatedData(cleanedData);
    setExpenses(aggregatedExpenses);
    setIncomes(aggregatedIncomes);
  };

  const generateAggregatedData = (data) => {
    const expensesMap = {};
    const incomesMap = {};

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const description = row["תאור"];
      const amount = parseFloat(row["סכום"]) || 0;
      const type = row["זיכוי/חיוב"];
      const status = row["סטטוס"] === "ההעברה בוצעה";
      const person = row["מאת/ל"];
      const date = row["תאריך"];

      if (status) {
        if (type === "חיוב") {
          if (!expensesMap[description]) {
            expensesMap[description] = {
              amount: 0,
              description: description,
              transactions: [],
            };
          }
          expensesMap[description].transactions.push({ date, amount, person });
          expensesMap[description].amount += amount;
        }

        if (type === "זיכוי") {
          if (!incomesMap[description]) {
            incomesMap[description] = {
              amount: 0,
              description: description,
              transactions: [],
            };
          }
          incomesMap[description].transactions.push({ date, amount, person });
          incomesMap[description].amount += amount;
        }
      }
    }

    return {
      aggregatedExpenses: Object.values(expensesMap),
      aggregatedIncomes: Object.values(incomesMap),
    };
  };

  const getIncomeExpenseChart = () => {
    if (data.length === 0) return {};

    const totals = {};

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const type = row["זיכוי/חיוב"];
      const amount = parseFloat(row["סכום"]) || 0;

      if (totals[type]) {
        totals[type] += amount;
      } else {
        totals[type] = amount;
      }
    }

    return {
      labels: Object.keys(totals),
      datasets: [
        {
          data: Object.values(totals),
          backgroundColor: ["#00FF00", "#FF0000"],
          hoverBackgroundColor: ["#00FF00", "#FF0000"],
        },
      ],
    };
  };

  const getExpensesChartData = () => {
    if (expenses.length === 0) return {};

    const totals = {};

    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      const description = expense.description;
      const amount = expense.amount;

      totals[description] = (totals[description] || 0) + amount;
    }

    return {
      labels: Object.keys(totals),
      datasets: [
        {
          data: Object.values(totals),
          backgroundColor: Object.keys(totals).map(
            (_, index) =>
              `hsl(${(360 * index) / Object.keys(totals).length}, 70%, 50%)`
          ),
          hoverBackgroundColor: Object.keys(totals).map(
            (_, index) =>
              `hsl(${(360 * index) / Object.keys(totals).length}, 80%, 60%)`
          ),
        },
      ],
    };
  };

  // Handle slice click to update selected description
  const handleSliceClick = (description) => {
    setSelectedDescription(description);
    console.log(selectedDescription);
  };

  return (
    <div className="csv-reader-container">
      <div className="file-input-wrapper">
        <FileInput handleFileChange={handleFileChange} handleAnalyze={handleAnalyze} />
      </div>
      {data.length > 0 && (
        <div className="charts-container">
          <div className="pie-chart-container">
            <PieChart data={getIncomeExpenseChart()} />
          </div>
          <div className="expense-chart-container">
            <h2 className="chart-title">Expenses by Categories</h2>
            <PieChart data={getExpensesChartData()} onSliceClick={handleSliceClick} />
          </div>
        </div>
      )}
      {selectedDescription && (
        <div className="expenses-list">
        {expenses
          .filter((expense) => {
            const isMatch = expense.description === selectedDescription;
            console.log(`Filtering for description: ${selectedDescription}, Current description: ${expense.description}, Match: ${isMatch}`);
            return isMatch;
          })
          .map((expense, index) => (
            <TransactionList
              key={index}
              description={expense.description}
              amount={expense.amount}
              transactions={expense.transactions}
            />
          ))}
      </div>
      
      )}
      {data.length > 0 && (
        <div className="table-wrapper">
          <div className="show-table-button">
            <ToggleTableButton showTable={showTable} onToggle={() => setShowTable(!showTable)} />
          </div>
          {showTable && <TableComponent data={data} />}
        </div>
      )}
      <pre>{JSON.stringify(expenses, null, 2)}</pre>
      <pre>{JSON.stringify(incomes, null, 2)}</pre>
    </div>
  );
};

export default CsvReader;
