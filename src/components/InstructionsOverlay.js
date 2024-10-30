// src/components/InstructionsOverlay.js
import React from "react";
import "../assets/styles/App.css"; // Make sure to import your styles
import Step1Image from "../assets/images/app_screenshot1.png";
import Step2Image from "../assets/images/app_screenshot2.png";
import Step3Image from "../assets/images/app_screenshot3.png";

const InstructionsOverlay = ({ onClose }) => {
  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <div className="instructions-overlay" onClick={handleOverlayClick}>
      <div className="instructions-frame" onClick={(e) => e.stopPropagation()}>
        {/* Instructions content here */}
        <h2>?איך משתמשים</h2>
        <p>Welcome to the CSV Analyzer! Follow these steps to get started:</p>
        <ol>
          <li>
            <strong>Choose Your CSV File:</strong>
            <p>
              Click on the <strong>"Choose File"</strong> button to select your
              CSV file.
            </p>
            <img
              src={Step1Image}
              alt="Choose File Button"
              className="instruction-image"
            />
          </li>
          <li>
            <strong>Analyze the Data:</strong>
            <p>
              Once selected, click on the <strong>"Analyze"</strong> button to
              process the data.
            </p>
            <img
              src={Step2Image}
              alt="Analyze Button"
              className="instruction-image"
            />
          </li>
          <li>
            <strong>Explore Your Data:</strong>
            <p>
              Use the charts and tables below to explore and interact with your
              data.
            </p>
            <img
              src={Step3Image}
              alt="Data Visualization"
              className="instruction-image"
            />
          </li>
        </ol>
        <p>Click outside this frame to close the instructions.</p>
      </div>
    </div>
  );
};

export default InstructionsOverlay;
