// src/components/MiniTableComponent.js

import React, { useState } from "react";

const MiniTableComponent = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  if (data.length === 0) {
    return <p>לא בוצעו העברות בתאריכים אלו</p>;
  }

  // Exclude 'סטטוס' and 'זיכוי/חיוב' columns, rename 'מאת/ל' to 'אל'
  const headers = Object.keys(data[0])
    .filter(
      (header) =>
        header !== "סטטוס" &&
        header !== "אמצעי תשלום" &&
        header !== "זיכוי/חיוב"
    )
    .map((header) => (header === "מאת/ל" ? "אל" : header));

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const compareValues = (a, b, key) => {
    const aValue = a[key === "אל" ? "מאת/ל" : key];
    const bValue = b[key === "אל" ? "מאת/ל" : key];

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

    return aValue.localeCompare(bValue, "he");
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const comparisonResult = compareValues(a, b, sortConfig.key);
    return sortConfig.direction === "asc"
      ? comparisonResult
      : -comparisonResult;
  });

  return (
    <div style={{ overflowY: "auto", maxHeight: "200px", margin: "10px" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  border: "1px solid black",
                  padding: "4px",
                  fontSize: "1.00em",
                  cursor: "pointer",
                  backgroundColor: "lightblue",
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
            <tr key={index}>
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
                  {row[header === "אל" ? "מאת/ל" : header]}
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
