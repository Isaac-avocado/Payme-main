document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('credit-cards-container');

    // Listener para eliminar tarjetas
    container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const card = e.target.closest('.credit-card');
            const cardId = card.dataset.id;

            // Verificar que cardId no es undefined
            if (!cardId) {
                console.error('cardId is undefined:', cardId);
                return;
            }

            const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage

            try {
                // Llamada a la API para eliminar la tarjeta
                const response = await fetch(`/api/cards/${cardId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token // Incluir el token en el encabezado de la solicitud
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
