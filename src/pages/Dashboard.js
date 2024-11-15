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
import { FaQuestionCircle } from "react-icons/fa";
import SpendingSummary from "../components/SpendingSummary";
import Footer from "../components/common/Footer";
import Logo from "../components/common/Logo";

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

const Dashboard = ({ setDateRange }) => {
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
    let headers = result.meta.fields || [];
    headers = headers.map((header) => header.trim());
    console.log(headers);

    if (headers.includes("תאור")) {
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
      {/* Centered Logo */}
      <div className="logo-container">
        <Logo />
      </div>

      {showInstructions && (
        <InstructionsOverlay onClose={() => setShowInstructions(false)} />
      )}

      <div className="file-input-wrapper">
        {parsedData.length === 0 && (
          <button
            onClick={() => setShowInstructions(true)}
            title="?איך משתמשים"
            className="instructions-icon"
          >
            <FaQuestionCircle size={24} />
          </button>
        )}

        <FileInput
          handleFileChange={handleFileChange}
          handleAnalyze={handleAnalyze}
        />
      </div>

      {parsedData.length > 0 && <SpendingSummary transactions={parsedData} />}

      <div className="secondaries-charts-container">
        <div className="charts-row">
          {parsedData.length > 0 && (
            <div className="chart-wrapper">
              <h2>ההעברות הגדולות</h2>
              <BarChart
                data={generateTop5ExpensesChartData(parsedData)}
                title="Top 5 Expenses"
              />
            </div>
          )}
          {parsedData.length > 0 && (
            <div className="chart-wrapper">
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
            <div className="chart-wrapper">
              <h2>הוצאות מצטברות לאורך זמן</h2>
              <LineChart
                data={generateCumulativeExpensesOverTimeData(parsedData)}
              />
            </div>
          )}
        </div>
      </div>

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
        />
      )}

      {/* Centered Footer */}
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
