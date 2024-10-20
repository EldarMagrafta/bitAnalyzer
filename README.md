# bitAnalyzer

bitAnalyzer is a simple Java-based application for analyzing financial transactions from "bit" app by "Bank Hapoalim". It processes data to calculate total income, total expenses, and provides a breakdown of expenses by description, including visualization through a web interface.

## Features

- **CSV Parsing**: Reads and processes transaction data from CSV files.
- **Expense and Income Calculation**: Calculates total income and total expenses.
- **Data Visualization**: Displays expenses by category using an interactive pie chart.
- **Detailed Breakdown**: Click on any category in the pie chart to see detailed transactions related to that category.

## Technology Stack

- **Java**: Backend processing using Java and `com.opencsv` for CSV file reading.
- **HTTP Server**: Built-in HTTP server to handle CSV file uploads.
- **Frontend**: HTML, JavaScript, and `Chart.js` for data visualization.
- **JSON**: Uses JSON for structured data exchange between the server and the web interface.

## Prerequisites

- **Java 8 or higher** installed on your system.
- **json-20230227.jar** in the `lib` directory for JSON processing.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EldarMagrafta/bitAnalyzer.git
   cd bitAnalyzer

2. **Compile and run the server**:
   ```bash
   javac -cp lib/json-20230227.jar:src src/SimpleCSVServer.java src/Transaction.java
   java -cp lib/json-20230227.jar:src SimpleCSVServer


3. **Access the Web Interface**:
   Open web/index.html in a browser.
   Upload a CSV file and view the analysis results.
