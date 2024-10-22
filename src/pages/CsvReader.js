import React, {useState, useEffect} from 'react';
import Papa from 'papaparse';
import PieChart from '../components/PieChart';
import TableComponent from '../components/TableComponent';
import FileInput from '../components/FileInput';
import ToggleTableButton from '../components/ToggleTableButton';
import TransactionList from '../components/TransactionList';
import '../assets/styles/App.css';

const CsvReader = ({setDateRange}) => {
    const [data, setData] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [expensesByPerson, setExpensesByPerson] = useState([]);
    const [expensesByMonth, setExpensesByMonth] = useState([]);
    const [file, setFile] = useState(null);
    const [showTable, setShowTable] = useState(true);
    const [selectedDescription, setSelectedDescription] = useState(null);

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
      setDateRange([date1, date2]); // Pass dates as an array
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
        const {aggregatedExpenses, expensesByPerson, expensesByMonth} = generateAggregatedData(cleanedData);
        setExpenses(aggregatedExpenses);
        setExpensesByPerson(expensesByPerson);
        setExpensesByMonth(expensesByMonth);
    };

    const generateAggregatedData = (data) => {
        const expensesMap = {};
        const expensesByPersonMap = {};
        const expensesByMonthMap = {};

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const description = row['תאור'];
            const amount = parseFloat(row['סכום']) || 0;
            const type = row['זיכוי/חיוב'];
            const status = row['סטטוס'] === 'ההעברה בוצעה';
            const person = row['מאת/ל'];
            const date = row['תאריך'];
            const [day, month, year] = date.split('.').map(Number);
            const monthKey = `${month}/${year}`;

            if (status && type === 'חיוב') {
                if (!expensesMap[description]) {
                    expensesMap[description] = {
                        amount: 0,
                        description: description,
                        transactions: [],
                    };
                }
                expensesMap[description].transactions.push({date, amount, person});
                expensesMap[description].amount += amount;

                if (!expensesByPersonMap[person]) {
                    expensesByPersonMap[person] = {
                        amount: 0,
                        person: person,
                        transactions: [],
                    };
                }
                expensesByPersonMap[person].transactions.push({date, amount, person});
                expensesByPersonMap[person].amount += amount;

                if (!expensesByMonthMap[monthKey]) {
                    expensesByMonthMap[monthKey] = {
                        amount: 0,
                        month: monthKey,
                        transactions: [],
                    };
                }
                expensesByMonthMap[monthKey].transactions.push({date, amount, person});
                expensesByMonthMap[monthKey].amount += amount;
            }
        }

        return {
            aggregatedExpenses: Object.values(expensesMap),
            expensesByPerson: Object.values(expensesByPersonMap),
            expensesByMonth: Object.values(expensesByMonthMap),
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

  // Function to map month numbers to Hebrew month names
  const getMonthName = (monthNumber) => {
    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    return monthNames[monthNumber - 1]; // monthNumber is 1-indexed, array is 0-indexed
  };

  const getExpensesByMonthChartData = () => {
    if (expenses.length === 0) return {};

    const totals = {};

    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      expense.transactions.forEach(({date, amount}) => {
        const [day, month] = date.split('.').map(Number);
        const monthName = getMonthName(month);

        totals[monthName] = (totals[monthName] || 0) + amount;
      });
    }

    const labels = Object.keys(totals);
    const dataValues = Object.values(totals);

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

    return (
        <div className="csv-reader-container">
            <div className="file-input-wrapper">
                <FileInput handleFileChange={handleFileChange} handleAnalyze={handleAnalyze}/>
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
                        <h2 className="chart-title">כל ההוצאות</h2>
                        <PieChart data={getExpensesChartData()} onSliceClick={handleSliceClick}/>
                    </div>
                </div>
            )}
            {data.length > 0 && (
                <div className="multiple-pie-chart-wrapper">
                    <div className="medium-pie-chart">
                      <h2 className="chart-title">הוצאות לפי אדם</h2>
                      <PieChart data={getExpensesByPersonChartData()}/>
                    </div>
                    <div className="medium-pie-chart">
                      <h2 className="chart-title">הוצאות לפי חודש</h2>
                      <PieChart data={getExpensesByMonthChartData()}/>
                    </div>
                </div>
            )}
            {data.length > 0 && (
                <div className="table-wrapper">
                    <div className="show-table-button">
                        <ToggleTableButton showTable={showTable}
                                           onToggle={() => setShowTable(!showTable)}/>
                    </div>
                    {showTable && <TableComponent data={data}/>}
                </div>
            )}
        </div>
    );
};

export default CsvReader;
