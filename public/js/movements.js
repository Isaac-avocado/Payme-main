document.addEventListener('DOMContentLoaded', async function() {
    const transactionsContainer = document.getElementById('transactions-container');
    const transactionsPlaceholder = document.getElementById('transactions-placeholder');

    if (transactionsContainer && transactionsPlaceholder) {
        console.log('Containers found, fetching transactions...');

        // Función para obtener los datos de la API
        async function fetchData(apiEndpoint) {
            const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage
            console.log('Fetching data with token:', token);

            const response = await fetch(apiEndpoint, {
                headers: {
                    'Authorization': token
                },
                credentials: 'include'
            });

            console.log('API response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }

        // Función para formatear la fecha
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
        }

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            console.log('Decoded userId from token:', userId);

            const transactions = await fetchData('http://localhost:3000/api/transactions/getUserTransactions');
            console.log('Transactions fetched:', transactions);

            if (transactions.length > 0) {
                transactionsPlaceholder.style.display = 'none';
                transactions.forEach(transaction => {
                    const transactionElement = document.createElement('div');
                    transactionElement.className = 'transaction';
                    console.log('Appending transaction:', transaction);

                    // Asegurarse de que transaction.amount es un número
                    const amount = parseFloat(transaction.amount);
                    if (isNaN(amount)) {
                        console.error('Transaction amount is not a number:', transaction.amount);
                        return;
                    }

                    // Determinar el símbolo basado en el tipo de transacción
                    const transactionIcon = transaction.type === 'income' ? '➕' : '➖';

                    transactionElement.innerHTML = `
                        <span class="transaction-icon">${transactionIcon}</span>
                        <div class="transaction-details">
                            <p class="small-label">Type</p>
                            <p class="large-label">${transaction.type}</p>
                        </div>
                        <div class="status">
                            <div class="status-circle ${transaction.user_id === userId ? 'red' : 'green'}"></div>
                            <span>${transaction.user_id === userId ? 'Sent' : 'Received'}</span>
                        </div>
                        <div class="invoice-info">
                            <p class="large-label">#${transaction.id}</p>
                            <p class="small-label">Transaction ID</p>
                        </div>
                        <div class="amount-info">
                            <p class="large-label">$${amount.toFixed(2)}</p>
                            <p class="small-label">${formatDate(transaction.created_at)}</p>
                        </div>
                    `;
                    transactionsContainer.appendChild(transactionElement);
                });
            } else {
                console.log('No transactions found.');
                transactionsPlaceholder.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    } else {
        console.error('Elemento transactionsContainer o transactionsPlaceholder no encontrado');
    }
});
