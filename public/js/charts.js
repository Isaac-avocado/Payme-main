document.addEventListener('DOMContentLoaded', function () {
    // Función para obtener los datos de la API
    async function fetchData(apiEndpoint) {
        const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage
        const response = await fetch(apiEndpoint, {
            headers: {
                'Authorization': token
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    // Configuración de la gráfica de ingresos
    async function createIncomeChart() {
        try {
            const data = await fetchData('http://localhost:3000/api/income'); // Endpoint de tu API para los ingresos
            const ctx = document.getElementById('incomeChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Income',
                        data: data.values,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Mostrar la suma total de ingresos
            document.querySelector('.total-income').textContent = `$${data.totalIncome.toFixed(2)}`;
        } catch (error) {
            console.error('Error creating income chart:', error);
        }
    }

    // Configuración de la gráfica de gastos
    async function createExpenseChart() {
        try {
            const data = await fetchData('http://localhost:3000/api/expenses'); // Endpoint de tu API para los gastos
            const ctx = document.getElementById('expenseChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Expenses',
                        data: data.values,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Mostrar la suma total de gastos
            document.querySelector('.total-expenses').textContent = `$${data.totalExpenses.toFixed(2)}`;
        } catch (error) {
            console.error('Error creating expense chart:', error);
        }
    }

    createIncomeChart();
    createExpenseChart();
});
