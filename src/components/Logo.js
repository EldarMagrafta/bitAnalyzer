import React from "react";

const Logo = () => {
  const handleLogoClick = () => {
    window.location.reload(); // This will refresh the page, re-rendering it
  };

  return (
    <img
      src={`${process.env.PUBLIC_URL}/logo.png`}
      alt="CSV Analyzer Logo"
      style={{ width: "150px", height: "auto", cursor: "pointer" }} // Add cursor style for pointer
      onClick={handleLogoClick} // Add onClick event to handle the reload
    />
  );
};

export default Logo;
