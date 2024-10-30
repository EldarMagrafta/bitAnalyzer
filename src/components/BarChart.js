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
        display: Boolean(title),
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
        suggestedMax: 800,
        ticks: {
          stepSize: 25,
        },
      },
    },
  };

  // Update the dataset to apply bar thickness
  const updatedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      barThickness: 50, // Set bar thickness to make bars narrower
      maxBarThickness: 50, // Optional, limit the maximum width if bars get too wide
    })),
  };

  return <Bar data={updatedData} options={options} />;
};

export default BarChart;
