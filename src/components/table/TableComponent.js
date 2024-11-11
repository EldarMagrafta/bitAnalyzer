import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload"; // Import FileDownload icon

const TableComponent = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const initialColumns = Object.keys(data[0]).map((header) => ({
        header,
        order: null,
      }));
      setSelectedColumns(initialColumns);
    }
  }, [data]);

  const setColumnOrder = (header) => {
    setSelectedColumns((prevColumns) => {
      const columnToToggle = prevColumns.find((col) => col.header === header);
      if (columnToToggle.order === null) {
        const nextOrder =
          Math.max(
            ...prevColumns.map((col) => (col.order !== null ? col.order : 0))
          ) + 1;

        return prevColumns.map((col) =>
          col.header === header ? { ...col, order: nextOrder } : col
        );
      } else {
        const removedOrder = columnToToggle.order;
        return prevColumns.map((col) =>
          col.header === header
            ? { ...col, order: null }
            : col.order > removedOrder
            ? { ...col, order: col.order - 1 }
            : col
        );
      }
    });
  };

  if (data.length === 0) {
    return <p>No data to display</p>;
  }

  const headers = Object.keys(data[0]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
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

    return aValue.localeCompare(bValue, "he");
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const comparisonResult = compareValues(a, b, sortConfig.key);
    return sortConfig.direction === "asc"
      ? comparisonResult
      : -comparisonResult;
  });

  const getBackgroundColorStyle = (row) => {
    const isStatusCompleted = row["סטטוס"] === "בוצע";
    const type = row["זיכוי/חיוב"];

    if (isStatusCompleted && type === "זיכוי") {
      return { backgroundColor: "#d4fdd4" };
    } else if (isStatusCompleted && type === "חיוב") {
      return { backgroundColor: "#ffd4d4" };
    } else {
      return { backgroundColor: "#CF142B" };
    }
  };

  const handleExportCSV = () => {
    const columnsInOrder = selectedColumns
      .filter((col) => col.order !== null)
      .sort((a, b) => b.order - a.order)
      .map((col) => col.header);

    const csvHeaders = columnsInOrder.join(",");
    const csvRows = sortedData.map((row) =>
      columnsInOrder.map((col) => `"${row[col] || ""}"`).join(",")
    );
    const csvContent = [csvHeaders, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bit_transactions_filtered.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isExportDisabled = !selectedColumns.some((col) => col.order !== null);

  return (
    <div style={{ width: "100%", maxWidth: "100%", margin: "20px auto" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto 20px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        {/* Export Button with download icon */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportCSV}
          disabled={isExportDisabled}
          startIcon={<FileDownloadIcon />} // Add download icon here
          sx={{
            marginBottom: "20px",
            marginRight: "20px",
            backgroundColor: isExportDisabled ? "#ddd" : undefined,
            color: isExportDisabled ? "#888" : undefined,
          }}
        >
          הורד קובץ
        </Button>

        {selectedColumns.map((col) => (
          <label
            key={col.header}
            style={{ display: "flex", alignItems: "center" }}
          >
            <button
              onClick={() => setColumnOrder(col.header)}
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
                backgroundColor: col.order ? "#4CAF50" : "#ddd",
                color: col.order ? "#fff" : "#000",
                border: "1px solid #000",
                borderRadius: "50%",
                textAlign: "center",
              }}
            >
              {col.order || ""}
            </button>
            {col.header}
          </label>
        ))}
      </div>

      {/* Table Component */}
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table
          style={{
            border: "1px solid black",
            borderCollapse: "collapse",
            width: "100%",
            minWidth: "800px",
            margin: "0 auto",
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
                      ? `${parseFloat(row[header])} ₪`
                      : row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
