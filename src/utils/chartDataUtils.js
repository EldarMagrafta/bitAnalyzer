//Generates chart data for the top 5 largest expenses.
export const generateTop5ExpensesChartData = (transactions) => {
  const top5expenses = transactions
    .filter((transaction) => transaction["זיכוי/חיוב"] === "חיוב")
    .sort((a, b) => parseFloat(b["סכום"]) - parseFloat(a["סכום"]))
    .slice(0, 5);

  const labels = top5expenses.map((expense) => expense["תאור"]);
  const dataValues = top5expenses.map((expense) => parseFloat(expense["סכום"]));
  const transactionInfo = top5expenses.map((expense) => ({
    label: expense["תאור"],
    amount: parseFloat(expense["סכום"]),
    date: expense["תאריך"],
    person: expense["מאת/ל"],
    type: expense["זיכוי/חיוב"],
  }));

  return {
    labels,
    datasets: [
      {
        label: "Top 5 Expenses",
        data: dataValues,
        transactionInfo: transactionInfo,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ], // Assign an array of colors
      },
    ],
  };
};

// Generates chart data to visualize monthly expenses.
export const generateMonthlyExpenseChartData = (expensesByMonth) => {
  if (!expensesByMonth || expensesByMonth.length === 0) return {};

  const labels = expensesByMonth.map((monthData) => monthData.month);
  const dataValues = expensesByMonth.map((monthData) => monthData.amount);

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

// Generates cumulative expenses data over time for a line chart.
export const generateCumulativeExpensesOverTimeData = (parsedData) => {
  if (parsedData.length === 0) return {};

  const expenses = filterExpenses(parsedData);
  const dateAmountMap = createDateAmountMap(expenses);
  const allDates = getSortedDates(dateAmountMap);

  if (allDates.length === 0) return {};

  const { firstTransactionDate, lastTransactionDate } =
    getFirstAndLastTransactionDates(allDates);
  const targetDates = generateTargetDates(
    firstTransactionDate,
    lastTransactionDate
  );
  const { labels, dataValues } = calculateCumulativeExpenses(
    dateAmountMap,
    allDates,
    targetDates
  );

  return {
    labels,
    datasets: [
      {
        label: "הוצאות מצטברות",
        data: dataValues,
        fill: false,
        backgroundColor: "#000080", // Navy blue
        borderColor: "#4BC0C0", // Teal
      },
    ],
  };
};

// Generates chart data for expenses by description/category.
export const generateDescriptionExpensesChartData = (expensesByDescription) => {
  if (!expensesByDescription || expensesByDescription.length === 0) return {};

  const labels = expensesByDescription.map((expense) => expense.description);
  const dataValues = expensesByDescription.map((expense) => expense.amount);

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

// Generates chart data for expenses by person.
export const generateExpensesByPersonChartData = (expensesByPerson) => {
  if (!expensesByPerson || expensesByPerson.length === 0) return {};

  const labels = expensesByPerson.map((personData) => personData.person);
  const dataValues = expensesByPerson.map((personData) => personData.amount);

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

// Generates data for a comparison chart of total income vs. expenses.
export const generateExpensesVsIncomesChartData = (
  totalIncomes,
  totalExpenses
) => {
  // Check if total incomes or total expenses are zero, to handle cases with no data
  if (totalIncomes === 0 && totalExpenses === 0) return {};

  const labels = ["כסף שקיבלתי", "כסף ששלחתי"];
  const dataValues = [totalIncomes, totalExpenses];
  const backgroundColors = ["#00FF00", "#FF0000"];
  const hoverBackgroundColors = ["#00FF00", "#FF0000"];

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

/************************ HELPER METHODS ************************/

// Filters parsed data to include only successful debit transactions
const filterExpenses = (data) => {
  return data.filter(
    (row) => row["סטטוס"] === "ההעברה בוצעה" && row["זיכוי/חיוב"] === "חיוב"
  );
};

// Creates a map of dates to total amounts for each date
const createDateAmountMap = (expenses) => {
  const dateAmountMap = {};
  expenses.forEach((row) => {
    const [dayStr, monthStr, yearStr] = row["תאריך"]
      .split(".")
      .map((s) => s.trim());
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10) + 2000; // Adjust for two-digit year

    const amount = parseFloat(row["סכום"]) || 0;
    const dateString = `${year}-${("0" + month).slice(-2)}-${("0" + day).slice(
      -2
    )}`;
    dateAmountMap[dateString] = (dateAmountMap[dateString] || 0) + amount;
  });
  return dateAmountMap;
};

// Returns sorted array of date strings
const getSortedDates = (dateAmountMap) => {
  return Object.keys(dateAmountMap).sort((a, b) => new Date(a) - new Date(b));
};

// Retrieves the first and last transaction dates from sorted dates
const getFirstAndLastTransactionDates = (allDates) => {
  const firstTransactionDate = new Date(allDates[0]);
  const lastTransactionDate = new Date(allDates[allDates.length - 1]);
  return { firstTransactionDate, lastTransactionDate };
};

// Generates target dates for charting cumulative expenses
const generateTargetDates = (firstTransactionDate, lastTransactionDate) => {
  const targetDatesSet = new Set();
  targetDatesSet.add(firstTransactionDate.getTime());

  let currentDate = new Date(
    Date.UTC(
      firstTransactionDate.getUTCFullYear(),
      firstTransactionDate.getUTCMonth(),
      1
    )
  );

  while (currentDate <= lastTransactionDate) {
    targetDatesSet.add(
      new Date(
        Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
      ).getTime()
    );
    targetDatesSet.add(
      new Date(
        Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 15)
      ).getTime()
    );
    currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
  }

  if (lastTransactionDate.getTime() !== firstTransactionDate.getTime()) {
    targetDatesSet.add(lastTransactionDate.getTime());
  }

  return Array.from(targetDatesSet)
    .sort((a, b) => a - b)
    .map((ts) => new Date(ts));
};

// Calculates cumulative expenses up to each target date
const calculateCumulativeExpenses = (dateAmountMap, allDates, targetDates) => {
  let cumulativeAmount = 0;
  const labels = [];
  const dataValues = [];
  let expenseIndex = 0;

  targetDates.forEach((targetDate) => {
    while (
      expenseIndex < allDates.length &&
      new Date(allDates[expenseIndex]) <= targetDate
    ) {
      cumulativeAmount += dateAmountMap[allDates[expenseIndex]];
      expenseIndex++;
    }

    labels.push(
      `${("0" + targetDate.getUTCDate()).slice(-2)}-${(
        "0" +
        (targetDate.getUTCMonth() + 1)
      ).slice(-2)}`
    );
    dataValues.push(cumulativeAmount);
  });

  return { labels, dataValues };
};
