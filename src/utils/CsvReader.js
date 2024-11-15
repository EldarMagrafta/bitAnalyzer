import Papa from "papaparse";
import { processIphoneCsv, processAndroidCsv } from "./parsing";

/**
 * Parses the CSV file and determines the processing function based on headers.
 * @param {File} file - The uploaded CSV file.
 * @param {Function} onComplete - Callback function to handle parsed data.
 */
export const analyzeCsvFile = (file, onComplete) => {
  if (!file) {
    throw new Error("Please select a file before analyzing.");
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => selectProcessingFunction(result, onComplete),
  });
};

/**
 * Selects the appropriate processing function based on the CSV headers.
 * @param {Object} result - Parsed result from PapaParse.
 * @param {Function} onComplete - Callback function to handle processed data.
 */
const selectProcessingFunction = (result, onComplete) => {
  const headers = (result.meta.fields || []).map((header) => header.trim());

  if (headers.includes("תאור")) {
    // iPhone CSV
    const processedData = processIphoneCsv(result);
    onComplete(processedData);
  } else if (headers.includes("תיאור")) {
    // Android CSV
    const processedData = processAndroidCsv(result);
    onComplete(processedData);
  } else {
    throw new Error("Unknown device type. Please check the file format.");
  }
};

/**
 * Extracts date range from parsed CSV data.
 * @param {Array} parsedData - The array of parsed transactions.
 * @returns {Array} - [startDate, endDate] in 'DD/MM/YYYY' format.
 */
export const extractDateRange = (parsedData) => {
  if (!parsedData.length) return [];

  const dates = parsedData
    .map((row) => {
      const [day, month, year] = row["תאריך"].split(".").map(Number);
      return new Date(year + 2000, month - 1, day);
    })
    .sort((a, b) => a - b);

  const startDate = dates[0]?.toLocaleDateString("en-GB");
  const endDate = dates[dates.length - 1]?.toLocaleDateString("en-GB");

  return [startDate, endDate];
};
