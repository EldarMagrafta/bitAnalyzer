import React from "react";
import CsvReader from "./CsvReader";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack items vertically
        alignItems: "center", // Center items horizontally
        justifyContent: "center", // Center items vertically within the container
      }}
    >
      <h1>CSV Analyzer</h1>
      <CsvReader />
    </div>
  );
}

export default App;
