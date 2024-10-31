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
        {/* Instructions content */}
        <h2 id="instructions-title">ברוכים הבאים ל-bit Analyzer!</h2>
        <p>
          כאן תוכלו לקבל מידע על כל העברות הכספים שביצעתם באמצעות אפליקציית ביט.
          <br />
          עקבו אחרי השלבים הבאים כדי להתחיל:
        </p>

        <ol>
          <li>
            <strong>לחצו על תפריט ההמבורגר בעמוד הראשי באפליקציית ביט:</strong>
            <img
              src={Step1Image}
              alt="כפתור בחירת קובץ"
              className="instruction-image"
            />
          </li>
          <li>
            <strong>
              לחצו על "ייצוא הפעולות כקובץ" על מנת לייצר קובץ csv עם היסטוריית
              ההעברות
            </strong>
            <img
              src={Step2Image}
              alt="כפתור ניתוח"
              className="instruction-image"
            />
          </li>
          <li>
            <strong>בחרו בשנה הרצויה והורידו את הקובץ</strong>

            <img
              src={Step3Image}
              alt="ויזואליזציית נתונים"
              className="instruction-image"
            />
          </li>
        </ol>
      </div>
    </div>
  );
};

export default InstructionsOverlay;
