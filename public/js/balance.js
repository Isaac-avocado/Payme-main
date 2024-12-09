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

    try {
        const data = await fetchBalance();
        const balance = typeof data.balance === 'number' ? data.balance.toFixed(2) : '0.00'; // Manejar undefined o valores no numéricos

        document.getElementById('user-balance').textContent = `$${balance}`;
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
});
