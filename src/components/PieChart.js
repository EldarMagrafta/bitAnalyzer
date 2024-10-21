import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  return (
    <div style={{ width: "50%", margin: "0 auto" }}>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
