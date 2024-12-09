document.addEventListener('DOMContentLoaded', async function() {
    const transactionsContainer = document.getElementById('transactions-container');
    const transactionsPlaceholder = document.getElementById('transactions-placeholder');

    if (transactionsContainer && transactionsPlaceholder) {
        console.log('Containers found, fetching transactions...');

        async function fetchTransactions() {
            const token = localStorage.getItem('token');
            console.log('Fetching transactions with token:', token);

            const response = await fetch('http://localhost:3000/api/transactions/getUserTransactions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                console.error('Failed to fetch transactions, status:', response.status);
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

            const transactions = await fetchTransactions();
            console.log('Transactions fetched:', transactions);

            if (transactions.length > 0) {
                transactionsPlaceholder.style.display = 'none';
                transactions.forEach(transaction => {
                    const transactionElement = document.createElement('div');
                    transactionElement.className = 'transaction';
                    console.log('Appending transaction:', transaction);
                    transactionElement.innerHTML = `
                        <span class="transaction-icon">${transaction.user_id === userId ? '➖' : '➕'}</span>
                        <div class="transaction-details">
                            <p class="small-label">${transaction.user_id === userId ? 'To' : 'From'}</p>
                            <p class="large-label">${transaction.description}</p>
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
                            <p class="large-label">$${transaction.amount.toFixed(2)}</p>
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
