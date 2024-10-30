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
      tooltip: {
        callbacks: {
          label: function (context) {
            // Retrieve the transaction info for the specific data point
            const transactionDetails = data.datasets[0].transactionInfo[context.dataIndex];

            // Format the tooltip to show transaction details
            return [
              `Amount: ${transactionDetails.amount}`,
              `Date: ${transactionDetails.date}`,
              `Person: ${transactionDetails.person}`,
            ];
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
