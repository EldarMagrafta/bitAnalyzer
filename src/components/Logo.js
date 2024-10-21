import React from "react";

const Logo = () => {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/logo.png`} // Correctly reference the logo in the public folder
      alt="CSV Analyzer Logo"
      style={{ width: "150px", height: "auto" }} // Adjust size as needed
    />
  );
};

export default Logo;
