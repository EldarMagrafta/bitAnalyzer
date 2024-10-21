document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Processing...';
    resultDiv.className = '';

    const formData = new FormData();
    const fileInput = document.getElementById('csvFile');
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('http://localhost:8080/upload-csv', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        displayAnalysisResult(result);
    } catch (error) {
        resultDiv.innerText = 'An error occurred while uploading the file: ' + error.message;
        resultDiv.className = 'error';
        console.error('Error:', error);
    }
});

function displayAnalysisResult(data) {
    const resultDiv = document.getElementById('result');

    // Display total income and expense with Hebrew labels, ensuring "₪" is close to the amount
    resultDiv.innerHTML = `<p>כמה קיבלתי? ₪${data.totalIncome.toFixed(2)}</p>`;
    resultDiv.innerHTML += `<p>כמה העברתי? ₪${data.totalExpense.toFixed(2)}</p>`;

    // Extract expenses and transactions for rendering in the pie chart
    const expenses = {};
    const expenseDetails = {};

    data.expenses.forEach(expense => {
        expenses[expense.description] = expense.amount;
        expenseDetails[expense.description] = expense.transactions; // Store transactions for each description
    });

    // Render the pie chart with the extracted data
    renderPieChart(expenses, expenseDetails);
}



function renderPieChart(expenses, expenseDetails) {
    const labels = Object.keys(expenses);
    const data = Object.values(expenses);

    const ctx = document.getElementById('expenseChart').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: generateColors(labels.length),
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expenses by Description'
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const elementIndex = elements[0].index;
                    const label = labels[elementIndex];
                    const details = expenseDetails[label];
                    displayDetails(label, details);
                }
            }
        }
    });
}

function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        // Generate random colors for each slice
        colors.push(`hsl(${(360 * i) / count}, 70%, 60%)`);
    }
    return colors;
}

function displayDetails(description, details) {
    const detailDiv = document.getElementById('result');
    // Change the title to the desired format and set direction to RTL
    detailDiv.innerHTML = `<div><h3>כמה הוצאתי על ${description}?</h3>`;

    // Display transactions in a more user-friendly format, adding the ₪ symbol right next to the amount
    const detailsList = details.map(transaction => {
        return `<li>${transaction.date} | ${transaction.person} | ₪${transaction.amount.toFixed(2)}</li>`;
    }).join('');

    detailDiv.innerHTML += `<ul>${detailsList}</ul></div>`;
}



