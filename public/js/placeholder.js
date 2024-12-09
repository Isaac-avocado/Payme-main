document.addEventListener('DOMContentLoaded', async function () {
    const creditCardsContainer = document.getElementById('credit-cards-container');
    const placeholder = document.getElementById('card-placeholder');

    if (creditCardsContainer && placeholder) {
        async function fetchCards() {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/cards/getCards', {
                headers: {
                    'Authorization': token
                },
                credentials: 'include'
            });
            return await response.json();
        }

        // Funci贸n para formatear la fecha en MM/YY
        function formatDate(dateString) {
            const date = new Date(dateString);
            const month = ("0" + (date.getUTCMonth() + 1)).slice(-2); // Obtener el mes con dos d铆gitos
            const year = date.getUTCFullYear().toString().slice(-2); // Obtener los 煤ltimos dos d铆gitos del a帽o
            return `${month}/${year}`;
        }

        // Funci贸n para eliminar una tarjeta
        async function deleteCard(cardId, cardElement) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3000/api/cards/${cardId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (response.ok) {
                    cardElement.remove(); // Eliminar la tarjeta del DOM
                    if (creditCardsContainer.children.length === 0) {
                        placeholder.style.display = 'flex'; // Mostrar placeholder si no hay tarjetas
                    }
                } else {
                    console.error('Error al eliminar la tarjeta:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud de eliminaci贸n:', error);
            }
        }

        try {
            const cards = await fetchCards();
            if (cards.length > 0) {
                placeholder.style.display = 'none';
                cards.forEach(card => {
                    const cardElement = document.createElement('div');
                    cardElement.className = 'credit-card';
                    cardElement.dataset.id = card.id; // Asignar ID de la tarjeta
                    cardElement.innerHTML = `
                        <div class="card-icon">💳</div>
                        <div class="card-details">
                            <span class="card-number">**** **** **** ${card.number.slice(-4)}</span>
                            <p class="card-label">Expires: ${formatDate(card.expire_date)}</p>
                        </div>
                        <button class="delete-btn">Delete</button>
                    `;
                    creditCardsContainer.appendChild(cardElement);

                    // Agregar evento al boton de eliminar
                    const deleteBtn = cardElement.querySelector('.delete-btn');
                    deleteBtn.addEventListener('click', () => deleteCard(card.id, cardElement));
                });
            } else {
                placeholder.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    } else {
        console.error('Elemento creditCardsContainer o placeholder no encontrado');
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    const transactionsContainer = document.getElementById('transactions-container');
    const transactionsPlaceholder = document.getElementById('transactions-placeholder');

    if (transactionsContainer && transactionsPlaceholder) {
        async function fetchTransactions() {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/transactions/getUserTransactions', {
                headers: {
                    'Authorization': token
                },
                credentials: 'include'
            });
            return await response.json();
        }

        // Función para formatear la fecha
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
        }

        try {
            const transactions = await fetchTransactions();
            if (transactions.length > 0) {
                transactionsPlaceholder.style.display = 'none';
                transactions.forEach(transaction => {
                    const transactionElement = document.createElement('div');
                    transactionElement.className = 'transaction';
                    transactionElement.innerHTML = `
                        <span class="transaction-icon">${transaction.user_id === userId ? '➖' : '➕'}</span>
                        <div class="transaction-details">
                            <p class="small-label">${transaction.user_id === userId ? 'To' : 'From'}</p>
                            <p class="large-label">${transaction.receiver_name}</p>
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
                transactionsPlaceholder.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    } else {
        console.error('Elemento transactionsContainer o transactionsPlaceholder no encontrado');
    }
});
