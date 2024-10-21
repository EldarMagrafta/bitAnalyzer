// src/components/FileInput/FileInput.js
import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined'; // Import the CloudUploadOutlined icon

// Custom styled component to hide the actual file input
const FileInputStyled = styled('input')({
  display: 'none', // Hide the file input
});

const FileInput = ({ handleFileChange, handleAnalyze }) => {
  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the file input when the button is clicked
  };

  return (
    <div className="file-input-container" style={{ textAlign: 'center' }}>
      <FileInputStyled
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <Button
        variant="contained"
        component="span"
        startIcon={<CloudUploadIcon />} // Add the cloud upload icon
        onClick={handleButtonClick}
        sx={{ marginRight: 2 }} // Adds space between the buttons
      >
        Upload CSV
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleAnalyze}
        disabled={!fileInputRef.current?.files.length} // Disable until a file is selected
      >
        Analyze
      </Button>
    </div>
  );
};

export default FileInput;
