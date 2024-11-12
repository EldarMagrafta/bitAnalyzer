// src/components/InstructionsOverlay.js
import React from "react";
import "../../assets/styles/App.css"; // Make sure to import your styles
import Step1Image from "../../assets/images/app_screenshot1.png";
import Step2Image from "../../assets/images/app_screenshot2.png";

const InstructionsOverlay = ({ onClose }) => {
  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <div
      className="instructions-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-title"
    >
      <div
        className="instructions-frame"
        onClick={(e) => e.stopPropagation()}
        dir="rtl" // Set direction to right-to-left
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Close overlay"
        >
          ×
        </button>

        {/* Instructions content */}
        <h2 id="instructions-title">ברוכים הבאים ל-bit Analyzer!</h2>
        <p>
          כאן תוכלו לקבל מידע על כל העברות הכספים שביצעתם באמצעות אפליקציית ביט.
          <br />
          עקבו אחרי השלבים הבאים כדי להתחיל:
        </p>

        <ol>
          <li>
            <strong>עברו לעמוד "פרופיל" ולחצו על "הורדת תנועות ב-CSV":</strong>
            <img
              src={Step1Image}
              alt="כפתור בחירת קובץ"
              className="instruction-image"
              style={{ transform: "scale(0.85)" }} // Shrinks the image to 80%
            />
          </li>
          <li>
            <strong>בחרו בשנה הרצויה והורידו את הקובץ</strong>
            <img
              src={Step2Image}
              alt="כפתור ניתוח"
              className="instruction-image"
              style={{ transform: "scale(0.85)" }} // Shrinks the image to 80%
            />
          </li>
        </ol>
      </div>
    </div>
  );
};

export default InstructionsOverlay;
