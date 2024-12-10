document.addEventListener('DOMContentLoaded', async function() {
    const datePicker = document.getElementById('date-picker');
    const allMovementsBtn = document.querySelector('.all-movements-btn');
    const transactionsContainer = document.getElementById('transactions-container');
    const transactionsPlaceholder = document.getElementById('transactions-placeholder');

    let userId; // Variable para almacenar el userId

    // Obtener el userId del token JWT
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const decodedToken = jwt_decode(token);
        userId = decodedToken.userId; // Decodificar el userId
    } catch (error) {
        console.error('Error decoding token:', error);
        return; // Salir si no se puede obtener el userId
    }

    // Función para formatear la fecha
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
            ', ' +
            date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }

    async function fetchTransactionsByDate(date) {
        const token = localStorage.getItem('token');
        const apiEndpoint = date 
            ? `http://localhost:3000/api/transactions/getUserTransactionsByDate?date=${date}` 
            : 'http://localhost:3000/api/transactions/getUserTransactions';

        const response = await fetch(apiEndpoint, {
            headers: { 'Authorization': token },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async function renderTransactions(date = null) {
        try {
            const transactions = await fetchTransactionsByDate(date);
            transactionsContainer.innerHTML = ''; // Limpiar contenedor

            if (transactions.length > 0) {
                transactionsPlaceholder.style.display = 'none';
                transactions.forEach(transaction => {
                    const transactionElement = document.createElement('div');
                    transactionElement.className = 'transaction';

                    const amount = parseFloat(transaction.amount) || 0;
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
                transactionsPlaceholder.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }

    datePicker.addEventListener('change', () => {
        const selectedDate = datePicker.value;
        renderTransactions(selectedDate);
    });

    allMovementsBtn.addEventListener('click', () => {
        renderTransactions(null);
    });

    // Render all transactions on page load
    renderTransactions();
});
