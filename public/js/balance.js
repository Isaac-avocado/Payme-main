document.addEventListener('DOMContentLoaded', async function() {
    async function fetchBalance() {
        const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage
        const response = await fetch('http://localhost:3000/api/balance', {
            headers: {
                'Authorization': token
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error fetching balance');
        }

        return await response.json();
    }

    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    try {
        const data = await fetchBalance();
        const balance = typeof data.balance === 'number' ? data.balance : 0.00; // Manejar undefined o valores no numéricos

        document.getElementById('user-balance').textContent = formatCurrency(balance);
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
});
