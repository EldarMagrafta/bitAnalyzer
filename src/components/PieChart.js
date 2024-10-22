// src/components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, onSliceClick }) => {
  const handleClick = (event, elements) => {
    if (elements && elements.length > 0) {
      const index = elements[0].index; // Get the index of the clicked slice
      const label = data.labels[index]; // Get the label (description) of the clicked slice
      if (onSliceClick) {
        onSliceClick(label); // Call the function passed as a prop with the label
      }
    }
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <Pie
        data={data}
        options={{
          onClick: handleClick, // Use the onClick option instead of a custom prop
        }}
      />
    </div>
  );
};

export default PieChart;
