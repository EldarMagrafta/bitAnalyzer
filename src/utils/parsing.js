// src/utils/parsing.js

export const processIphoneCsv = (result) => {
  const headers = result.meta.fields
    .map((header) => header.trim())
    .filter((header) => header !== "");

  const cleanedData = result.data
    .map((row) => {
      const cleanedRow = {};
      headers.forEach((header) => {
        cleanedRow[header] = row[header];
      });
      return cleanedRow;
    })
    .filter((row) =>
      Object.values(row).every(
        (value) => value && value.toString().trim() !== ""
      )
    );

  // Get aggregated data including totals
  const {
    aggregatedExpenses,
    expensesByPerson,
    expensesByMonth,
    totalIncome,
    totalExpense,
  } = generateAggregatedData(cleanedData);

  // Return all needed data including totals
  return {
    cleanedData,
    aggregatedExpenses,
    expensesByPerson,
    expensesByMonth,
    totalIncome,
    totalExpense,
  };
};

export const processAndroidCsv = (result) => {
  const headers = result.meta.fields
    .map((header) => header.trim())
    .filter((header) => header !== "");

  const idx = headers.indexOf("תיאור");
  headers[idx] = "תאור";

  const cleanedData = result.data
    .map((row) => {
      Object.keys(row).forEach((oldKey) => {
        const val = row[oldKey];
        row[oldKey.trim()] = val && typeof val === "string" ? val.trim() : val;
        row["תאור"] = row["תיאור"];
      });

      const cleanedRow = {};
      headers.forEach((header) => {
        cleanedRow[header] = row[header];
      });
      return cleanedRow;
    })
    .filter((row) =>
      Object.values(row).every(
        (value) => value && value.toString().trim() !== ""
      )
    );

  // Add missing "סטטוס" column
  cleanedData.forEach((row) => {
    row["סטטוס"] = "בוצע"; // Status for Android CSVs
  });

  // Get aggregated data, including totals
  const {
    aggregatedExpenses,
    expensesByPerson,
    expensesByMonth,
    totalIncome,
    totalExpense,
  } = generateAggregatedData(cleanedData);

  // Return all necessary data
  return {
    cleanedData,
    aggregatedExpenses,
    expensesByPerson,
    expensesByMonth,
    totalIncome,
    totalExpense,
  };
};

const generateAggregatedData = (data) => {
  const expensesMap = {};
  const expensesByPersonMap = {};
  const expensesByMonthMap = {};
  let totalIncome = 0;
  let totalExpense = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const description = row["תאור"];
    const amount = parseFloat(row["סכום"]) || 0;
    const type = row["זיכוי/חיוב"];
    const status = row["סטטוס"] === "בוצע";
    const person = row["מאת/ל"];
    const date = row["תאריך"];
    const [day, month, year] = date.split(".").map(Number);
    const monthName = getHebrewMonthName(month);

    if (status && type === "חיוב") {
      totalExpense += amount;

      if (!expensesMap[description]) {
        expensesMap[description] = {
          amount: 0,
          description: description,
          transactions: [],
        };
      }
      expensesMap[description].transactions.push({
        date,
        person,
        type,
        amount,
        description,
        status,
      });
      expensesMap[description].amount += amount;

      if (!expensesByPersonMap[person]) {
        expensesByPersonMap[person] = {
          amount: 0,
          person: person,
          transactions: [],
        };
      }
      expensesByPersonMap[person].transactions.push({
        date,
        person,
        type,
        amount,
        description,
        status,
      });
      expensesByPersonMap[person].amount += amount;

      if (!expensesByMonthMap[monthName]) {
        expensesByMonthMap[monthName] = {
          amount: 0,
          month: monthName,
          transactions: [],
        };
      }
      expensesByMonthMap[monthName].transactions.push({
        date,
        person,
        type,
        amount,
        description,
        status,
      });
      expensesByMonthMap[monthName].amount += amount;
    }
    if (status && type === "זיכוי") {
      totalIncome += amount; // Accumulate income amount
    }
  }

  return {
    aggregatedExpenses: Object.values(expensesMap),
    expensesByPerson: Object.values(expensesByPersonMap),
    expensesByMonth: Object.values(expensesByMonthMap),
    totalIncome,
    totalExpense,
  };
};

const getHebrewMonthName = (monthNumber) => {
  const monthNames = [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר",
  ];
  return monthNames[monthNumber - 1]; // monthNumber is 1-indexed
};

export default processIphoneCsv;
