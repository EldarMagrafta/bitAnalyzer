import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, onSliceClick }) => {
  const handleClick = (event, elements) => {
    console.log(elements);
    console.log(data);
    if (elements && elements.length > 0) {
      const index = elements[0].index;
      const label = data.labels[index];
      if (onSliceClick) {
        onSliceClick(label);
      }
    }
  };

  const handleHover = (event, elements) => {
    if (elements && elements.length) {
      event.native.target.style.cursor = "pointer"; // Set cursor to pointer on hover
    } else {
      event.native.target.style.cursor = "default"; // Revert cursor when not hovering over a slice
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Pie
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          onClick: handleClick,
          onHover: handleHover,
          plugins: {
            legend: {
              position: "right",
            },
            tooltip: {
              enabled: true,
            },
            datalabels: {
              display: false, // Ensure no data labels are displayed on the pie chart
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
