document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('credit-cards-container');

    // Listener para eliminar tarjetas
    container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const card = e.target.closest('.credit-card');
            const cardId = card.dataset.id; 

            try {
                // Llamada a la API para eliminar la tarjeta
                const response = await fetch('/api/cards/${cardId}', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    card.remove(); 
                } else {
                    console.error('Error al eliminar la tarjeta:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        }
    });
});