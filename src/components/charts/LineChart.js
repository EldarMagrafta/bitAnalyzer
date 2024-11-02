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
      tooltip: {
        callbacks: {
          label: function (context) {
            return `₪ ${context.parsed.y.toLocaleString()}`; // Format tooltip values
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'תאריך',
        },
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          autoSkip: true,
          maxTicksLimit: 10, // Adjust as needed
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'הוצאה מצטברת',
        },
        ticks: {
          stepSize: 500,
          beginAtZero: true,
          callback: function (value) {
            return `₪ ${value.toLocaleString()}`; // Format y-axis tick values
          },
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
