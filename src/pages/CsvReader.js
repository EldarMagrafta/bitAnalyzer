import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import PieChart from "../components/charts/PieChart";
import TableComponent from "../components/table/TableComponent";
import FileInput from "../components/FileInput";
import ToggleTableButton from "../components/table/ToggleTableButton";
import LineChart from "../components/charts/LineChart";
import ExpensesCategorySection from "../components/ExpensesCategorySection";
import BarChart from "../components/charts/BarChart";
import InstructionsOverlay from "../components/common/InstructionsOverlay";
import { FaQuestionCircle } from "react-icons/fa"; // Add a question mark icon library
import SpendingSummary from "../components/SpendingSummary"; // Import the SpendingSummary component

import { processIphoneCsv, processAndroidCsv } from "../utils/parsing";

import {
  generateTop5ExpensesChartData,
  generateMonthlyExpenseChartData,
  generateCumulativeExpensesOverTimeData,
  generateDescriptionExpensesChartData,
  generateExpensesByPersonChartData,
  generateExpensesVsIncomesChartData,
} from "../utils/chartDataUtils";
import "../assets/styles/App.css";

const CsvReader = ({ setDateRange }) => {
  const [parsedData, setParsedData] = useState([]);
  const [expensesByDescription, setExpensesByDescription] = useState([]);
  const [expensesByPerson, setExpensesByPerson] = useState([]);
  const [expensesByMonth, setExpensesByMonth] = useState([]);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [file, setFile] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (parsedData.length > 0) {
      const dates = parsedData
        .map((row) => {
          const [day, month, year] = row["תאריך"].split(".").map(Number);
          return new Date(year + 2000, month - 1, day);
        })
        .sort((a, b) => a - b);

      const date1 = dates[0]?.toLocaleDateString("en-GB");
      const date2 = dates[dates.length - 1]?.toLocaleDateString("en-GB");
      setDateRange([date1, date2]);
    }
  }, [parsedData, setDateRange]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAnalyze = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: selectProcessingFunction,
      });
    } else {
      alert("Please select a file before analyzing.");
    }
  };

  const selectProcessingFunction = (result) => {
    // Check the headers to determine the device type
    let headers = result.meta.fields || [];
    headers = headers.map((header) => header.trim());
    console.log(headers);

    if (headers.includes("תאור")) {
      // iPhone CSV
      const {
        cleanedData,
        aggregatedExpenses,
        expensesByPerson,
        expensesByMonth,
        totalIncome,
        totalExpense,
      } = processIphoneCsv(result);

      setParsedData(cleanedData);
      setExpensesByDescription(aggregatedExpenses);
      setExpensesByPerson(expensesByPerson);
      setExpensesByMonth(expensesByMonth);
      setTotalIncomes(totalIncome);
      setTotalExpenses(totalExpense);
    } else if (headers.includes("תיאור")) {
      // Android CSV
      const {
        cleanedData,
        aggregatedExpenses,
        expensesByPerson,
        expensesByMonth,
        totalIncome,
        totalExpense,
      } = processAndroidCsv(result);

      setParsedData(cleanedData);
      setExpensesByDescription(aggregatedExpenses);
      setExpensesByPerson(expensesByPerson);
      setExpensesByMonth(expensesByMonth);
      setTotalIncomes(totalIncome);
      setTotalExpenses(totalExpense);
    } else {
      alert("Unknown device type. Please check the file format.");
    }
  };

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description);
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  const handleMonthClick = (monthName) => {
    setSelectedMonth(monthName);
  };

  return (
    <div className="csv-reader-container">
      <div className="header">
        {parsedData.length === 0 && ( // Show the button only when parsedData is empty
          <button
            onClick={() => setShowInstructions(true)}
            title="?איך משתמשים"
            className="instructions-icon"
          >
            <FaQuestionCircle size={24} />
          </button>
        )}
      </div>

      {showInstructions && (
        <InstructionsOverlay onClose={() => setShowInstructions(false)} />
      )}

      <div className="file-input-wrapper">
        <FileInput
          handleFileChange={handleFileChange}
          handleAnalyze={handleAnalyze}
        />
      </div>

      {/* Include SpendingSummary and pass parsedData */}
      {parsedData.length > 0 && <SpendingSummary transactions={parsedData} />}

      <div className="charts-container">
        {/* Top 5 Expenses Bar Chart */}
        {parsedData.length > 0 && (
          <div className="chart-wrapper">
            <h2>ההעברות הגדולות</h2>
            <BarChart
              data={generateTop5ExpensesChartData(parsedData)}
              title="Top 5 Expenses"
            />
          </div>
        )}

        {/* הוצאות מצטברות לאורך זמן Section */}
        {parsedData.length > 0 && (
          <div className="chart-wrapper">
            <h2>הוצאות מצטברות לאורך זמן</h2>
            <LineChart
              data={generateCumulativeExpensesOverTimeData(parsedData)}
            />
          </div>
        )}
      </div>

      {/* Income vs Expense Pie Chart */}
      {parsedData.length > 0 && (
        <div>
          <h2 className="chart-title">הוצאות מול הכנסות</h2>
          <PieChart
            data={generateExpensesVsIncomesChartData(
              totalIncomes,
              totalExpenses
            )}
          />
        </div>
      )}

      {parsedData.length > 0 && (
        <div className="table-wrapper">
          <div className="show-table-button">
            <ToggleTableButton
              showTable={showTable}
              onToggle={() => setShowTable(!showTable)}
            />
          </div>
          {showTable && <TableComponent data={parsedData} />}
        </div>
      )}

      {/* "כל ההוצאות" Section */}
      {parsedData.length > 0 && (
        <ExpensesCategorySection
          title="כל ההוצאות"
          data={expensesByDescription}
          selectedItem={selectedDescription}
          onSliceClick={handleDescriptionClick}
          generateChartData={() =>
            generateDescriptionExpensesChartData(expensesByDescription)
          }
          transactionFields={["date", "amount", "person"]}
          identifierKey="description"
          className="all-expenses-section"
        />
      )}

      {/* Updated "הוצאות לפי חבר" Section */}
      {parsedData.length > 0 && (
        <ExpensesCategorySection
          title="הוצאות לפי חבר"
          data={expensesByPerson}
          selectedItem={selectedPerson}
          onSliceClick={handlePersonClick}
          generateChartData={() =>
            generateExpensesByPersonChartData(expensesByPerson)
          }
          transactionFields={["date", "amount", "description"]}
          identifierKey="person"
          className="all-expenses-section"
        />
      )}

      {/* "הוצאות לפי חודש" Section */}
      {parsedData.length > 0 && (
        <ExpensesCategorySection
          title="הוצאות לפי חודש"
          data={expensesByMonth}
          selectedItem={selectedMonth}
          onSliceClick={handleMonthClick}
          generateChartData={() =>
            generateMonthlyExpenseChartData(expensesByMonth)
          }
          transactionFields={["date", "amount", "description", "person"]}
          identifierKey="month"
          className="all-expenses-section" // Now this will work as expected
        />
      )}
    </div>
  );
};

export default CsvReader;
