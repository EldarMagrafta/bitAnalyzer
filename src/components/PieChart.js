// src/components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, onSliceClick }) => {
  const handleClick = (event, elements) => {
    if (elements && elements.length > 0) {
      const index = elements[0].index;
      const label = data.labels[index];
      if (onSliceClick) {
        onSliceClick(label);
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Pie
        data={data}
        options={{
          responsive: true, // Make sure it responds to the container size
          maintainAspectRatio: false, // Allows the chart to stretch to the container size
          onClick: handleClick,
        }}
      />
    </div>
  );
};

export default PieChart;
