// src/components/BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend);

const BarChart = ({ data, title }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: title,
      },
      legend: {
        display: false, // Disable legend interaction to prevent toggling
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const transactionDetails = data.datasets[0].transactionInfo[context.dataIndex];
            return [
              `סכום: ${transactionDetails.amount}`,
              `אל: ${transactionDetails.person}`,
              `תאריך: ${transactionDetails.date}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 800, // Suggests an upper limit for the Y-axis, adjust as needed
        ticks: {
          stepSize: 25,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
