import React from 'react';

const TableComponent = ({ data }) => {
  if (data.length === 0) {
    return <p>No data to display</p>;
  }

  // Extract the headers from the first row's keys
  const headers = Object.keys(data[0]);

  return (
    <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", margin: "20px 0" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} style={{ border: "1px solid black", padding: "8px" }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          const isStatusCompleted = row["סטטוס"] === "ההעברה בוצעה";
          const type = row["זיכוי/חיוב"];

          // Determine background color based on status and type
          let backgroundColor = "transparent";
          if (isStatusCompleted && type === "זיכוי") {
            backgroundColor = "#d4fdd4"; // Green for זיכוי if status is "ההעברה בוצעה"
          } else if (isStatusCompleted && type === "חיוב") {
            backgroundColor = "#ffd4d4"; // Red for חיוב if status is "ההעברה בוצעה"
          }

          return (
            <tr key={index} style={{ backgroundColor }}>
              {headers.map((header, i) => (
                <td key={i} style={{ border: "1px solid black", padding: "8px" }}>
                  {row[header]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableComponent;
