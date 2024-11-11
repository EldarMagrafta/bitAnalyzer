import React from "react";
import { Button } from "@mui/material";

const ToggleTableButton = ({ showTable, onToggle }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onToggle}
      sx={{ marginTop: 2 }} // Styling can also be done here or via classes
    >
      {showTable ? "הסתר היסטוריית העברות" : "הצג היסטוריית העברות מלאה"}
    </Button>
  );
};

export default ToggleTableButton;
