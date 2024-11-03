// src/components/MiniTableComponent.js

import React, { useState } from "react";

const MiniTableComponent = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (data.length === 0) {
    return <p>No data to display</p>;
  }

  const headers = Object.keys(data[0]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const compareValues = (a, b, key) => {
    const aValue = a[key];
    const bValue = b[key];

    if (key === "סכום") {
      const aNumber = parseFloat(aValue) || 0;
      const bNumber = parseFloat(bValue) || 0;
      return aNumber - bNumber;
    }

    if (key === "תאריך") {
      const [dayA, monthA, yearA] = aValue.split(".").map(Number);
      const [dayB, monthB, yearB] = bValue.split(".").map(Number);
      const dateA = new Date(yearA + 2000, monthA - 1, dayA);
      const dateB = new Date(yearB + 2000, monthB - 1, dayB);
      return dateA - dateB;
    }

    return aValue.localeCompare(bValue, 'he');
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const comparisonResult = compareValues(a, b, sortConfig.key);
    return sortConfig.direction === 'asc' ? comparisonResult : -comparisonResult;
  });

  const getBackgroundColorStyle = (row) => {
    const isStatusCompleted = row["סטטוס"] === "ההעברה בוצעה";
    const type = row["זיכוי/חיוב"];

    if (isStatusCompleted && type === "זיכוי") {
      return { backgroundColor: "#d4fdd4" };
    } else if (isStatusCompleted && type === "חיוב") {
      return { backgroundColor: "#ffd4d4" };
    } else {
      return { backgroundColor: "#CF142B" };
    }
  };

  return (
    <div style={{ overflowY: "auto", maxHeight: "200px", margin: "10px 0" }}>
      <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  border: "1px solid black",
                  padding: "4px",
                  fontSize: "0.85em",
                  cursor: "pointer",
                }}
                onClick={() => handleSort(header)}
              >
                {header} {sortConfig.key === header && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                    padding: "4px",
                    fontSize: "0.85em",
                    textAlign: "center",
                  }}
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MiniTableComponent;
