import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, Tooltip, Legend);

const BarChart = ({ data, title }) => {
  // Calculate the maximum value in the dataset
  const maxExpense = Math.max(...data.datasets[0].data);

  // Set dynamic max and stepSize based on the max expense value
  const maxScaleValue = Math.ceil(maxExpense / 100) * 100; // Round to the nearest hundred
  const stepSize = maxScaleValue / 10;

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: Boolean(title),
      },
      legend: {
        display: false, // Disable legend interaction to prevent toggling
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const transactionDetails =
              data.datasets[0].transactionInfo[context.dataIndex];
            return [
              `סכום: ₪${transactionDetails.amount}`,
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
        max: maxScaleValue, // Set max based on max expense value
        ticks: {
          stepSize: stepSize, // Set dynamic step size
          
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
