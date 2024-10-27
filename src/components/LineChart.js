// src/components/LineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend if not needed
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'תאריך',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'הוצאות מצטברות',
        },
      },
    },
  };

  return (
    <div className="line-chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
