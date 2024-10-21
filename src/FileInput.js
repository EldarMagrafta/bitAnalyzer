import React from 'react';

const FileInput = ({ handleFileChange, handleAnalyze }) => {
  return (
    <div className="file-input-container">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleAnalyze}>Upload & Analyze</button>
    </div>
  );
};

export default FileInput;
