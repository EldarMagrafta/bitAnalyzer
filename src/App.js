import React from "react";
import CsvReader from "./CsvReader";
import Logo from "./Logo"; // Import the new Logo component

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
      <Logo /> {/* Use the Logo component here */}
      <CsvReader />
    </div>
  );
}

export default App;
