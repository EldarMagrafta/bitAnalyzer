import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import PieChart from '../components/PieChart';
import TableComponent from '../components/TableComponent';
import FileInput from '../components/FileInput';
import ToggleTableButton from '../components/ToggleTableButton';
import TransactionList from '../components/TransactionList';
import '../assets/styles/App.css';

const CsvReader = ({ setDateRange }) => {
  const [data, setData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expensesByPerson, setExpensesByPerson] = useState([]); // State for expenses by person
  const [file, setFile] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null); // State for selected person

  useEffect(() => {
    if (data.length > 0) {
      const dates = data
        .map(row => {
          const [day, month, year] = row['תאריך'].split('.').map(Number);
          return new Date(year + 2000, month - 1, day);
        })
        .sort((a, b) => a - b);

      const date1 = dates[0]?.toLocaleDateString('en-GB');
      const date2 = dates[dates.length - 1]?.toLocaleDateString('en-GB');
      setDateRange(`${date1} to ${date2}`);
    }
  }, [data, setDateRange]);

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
      alert('Please select a file before analyzing.');
    }
  };

  const processCsvData = (result) => {
    const headers = result.meta.fields.filter((header) => header.trim() !== '');
    const cleanedData = result.data
      .map((row) => {
        const cleanedRow = {};
        headers.forEach((header) => {
          cleanedRow[header] = row[header];
        });
        return cleanedRow;
      })
      .filter((row) =>
        Object.values(row).some((value) => value && value.toString().trim() !== '')
      );

    setData(cleanedData);
    const { aggregatedExpenses, expensesByPerson } = generateAggregatedData(cleanedData);
    setExpenses(aggregatedExpenses);
    setExpensesByPerson(expensesByPerson);
  };

  const generateAggregatedData = (data) => {
    const expensesMap = {};
    const expensesByPersonMap = {};

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const description = row['תאור'];
      const amount = parseFloat(row['סכום']) || 0;
      const type = row['זיכוי/חיוב'];
      const status = row['סטטוס'] === 'ההעברה בוצעה';
      const person = row['מאת/ל'];
      const date = row['תאריך'];

      if (status && type === 'חיוב') {
        if (!expensesMap[description]) {
          expensesMap[description] = {
            amount: 0,
            description: description,
            transactions: [],
          };
        }
        expensesMap[description].transactions.push({ date, amount, person });
        expensesMap[description].amount += amount;

        if (!expensesByPersonMap[person]) {
          expensesByPersonMap[person] = {
            amount: 0,
            person: person,
            transactions: [],
          };
        }
        expensesByPersonMap[person].transactions.push({ date, amount, person });
        expensesByPersonMap[person].amount += amount;
      }
    }

    return {
      aggregatedExpenses: Object.values(expensesMap),
      expensesByPerson: Object.values(expensesByPersonMap),
    };
  };

  const getExpensesChartData = () => {
    if (expenses.length === 0) return {};

    const labels = expenses.map(expense => expense.description);
    const dataValues = expenses.map(expense => expense.amount);

    const backgroundColors = [];
    const hoverBackgroundColors = [];

    labels.forEach((_, index) => {
      const hue = (360 * index) / labels.length;
      backgroundColors.push(`hsl(${hue}, 70%, 50%)`);
      hoverBackgroundColors.push(`hsl(${hue}, 80%, 60%)`);
    });

    return {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors,
        },
      ],
    };
  };

  const getExpensesByPersonChartData = () => {
    if (expensesByPerson.length === 0) return {};

    const labels = expensesByPerson.map(personData => personData.person);
    const dataValues = expensesByPerson.map(personData => personData.amount);

    const backgroundColors = [];
    const hoverBackgroundColors = [];

    labels.forEach((_, index) => {
      const hue = (360 * index) / labels.length;
      backgroundColors.push(`hsl(${hue}, 70%, 50%)`);
      hoverBackgroundColors.push(`hsl(${hue}, 80%, 60%)`);
    });

    return {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors,
        },
      ],
    };
  };

  const handleSliceClick = (description) => {
    setSelectedDescription(description);
  };

  const handlePersonSliceClick = (person) => {
    setSelectedPerson(person);
  };

  return (
    <div className="csv-reader-container">
      <div className="file-input-wrapper">
        <FileInput handleFileChange={handleFileChange} handleAnalyze={handleAnalyze} />
      </div>
      {data.length > 0 && (
        <div className="chart-transaction-container">
          <div className="transaction-list-wrapper">
            {selectedDescription &&
              expenses
                .filter((expense) => expense.description === selectedDescription)
                .map((expense, index) => (
                  <TransactionList
                    key={index}
                    description={expense.description}
                    amount={expense.amount}
                    transactions={expense.transactions}
                  />
                ))}
          </div>
          <div className="pie-chart-wrapper">
            <PieChart data={getExpensesChartData()} onSliceClick={handleSliceClick} />
          </div>
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
      {data.length > 0 && (
        <div className="chart-transaction-container">
          <div className="transaction-list-wrapper">
            {selectedPerson &&
              expensesByPerson
                .filter((expense) => expense.person === selectedPerson)
                .map((expense, index) => (
                  <TransactionList
                    key={index}
                    description={`Transactions with ${expense.person}`}
                    amount={expense.amount}
                    transactions={expense.transactions}
                  />
                ))}
          </div>
          <div className="pie-chart-wrapper">
            <PieChart data={getExpensesByPersonChartData()} onSliceClick={handlePersonSliceClick} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvReader;
