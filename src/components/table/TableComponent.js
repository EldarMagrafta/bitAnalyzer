import React, { useState } from "react";

const TableComponent = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  if (data.length === 0) {
    return <p>No data to display</p>;
  }

  // Extract the headers from the first row's keys
  const headers = Object.keys(data[0]);

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Function to compare values based on column type
  const compareValues = (a, b, key) => {
    const aValue = a[key];
    const bValue = b[key];

    // Handle סכום as a number
    if (key === "סכום") {
      const aNumber = parseFloat(aValue) || 0;
      const bNumber = parseFloat(bValue) || 0;
      return aNumber - bNumber;
    }

    // Handle תאריך as a date (format: dd.mm.yy)
    if (key === "תאריך") {
      const [dayA, monthA, yearA] = aValue.split(".").map(Number);
      const [dayB, monthB, yearB] = bValue.split(".").map(Number);

      const dateA = new Date(yearA + 2000, monthA - 1, dayA);
      const dateB = new Date(yearB + 2000, monthB - 1, dayB);

      return dateA - dateB;
    }

    // Default string comparison for other columns
    return aValue.localeCompare(bValue, "he");
  };

  // Sort the data based on the selected column and direction
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0; // If no sorting is selected, keep original order

    const comparisonResult = compareValues(a, b, sortConfig.key);
    return sortConfig.direction === "asc"
      ? comparisonResult
      : -comparisonResult;
  });

  // Function to determine the background color of a row
  const getBackgroundColorStyle = (row) => {
    const isStatusCompleted = row["סטטוס"] === "בוצע";
    const type = row["זיכוי/חיוב"];

    if (isStatusCompleted && type === "זיכוי") {
      return { backgroundColor: "#d4fdd4" }; // Green for זיכוי if status is "בוצע"
    } else if (isStatusCompleted && type === "חיוב") {
      return { backgroundColor: "#ffd4d4" }; // Red for חיוב if status is "בוצע"
    } else {
      return { backgroundColor: "#CF142B" }; // No background if status is different
    }
  };

  return (
    <table
      style={{
        border: "1px solid black",
        borderCollapse: "collapse",
        width: "100%",
        margin: "20px 0",
      }}
    >
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{
                border: "1px solid black",
                padding: "8px",
                cursor: "pointer",
              }}
              onClick={() => handleSort(header)}
            >
              {header}{" "}
              {sortConfig.key === header &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => (
          <tr key={index} style={getBackgroundColorStyle(row)}>
            {headers.map((header, i) => (
              <td
                key={i}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {header === "סכום"
                  ? `${parseFloat(row[header])} ₪` // Display amount with ₪ for סכום column
                  : row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
