document.getElementById('card-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    let cardNumber = document.getElementById('card-number').value;
    let expireDate = document.getElementById('expire-date').value;
    let cvv = document.getElementById('cvv').value;

    let errors = [];

    // Limpiar los mensajes de error previos
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = "");

    // Validación para el número de tarjeta
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        document.getElementById('card-number').nextElementSibling.textContent = "Número de tarjeta inválido. Debe ser de 16 dígitos.";
        errors.push("Número de tarjeta inválido");
    }

    // Validación para la fecha de expiración
    if (!expireDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expireDate)) {
        document.getElementById('expire-date').nextElementSibling.textContent = "Fecha de expiración inválida. Usa el formato MM/AA.";
        errors.push("Fecha de expiración inválida");
    }

    // Validación para el CVV
    if (cvv.length !== 3 || isNaN(cvv)) {
        document.getElementById('cvv').nextElementSibling.textContent = "El CVV debe ser un número de 3 dígitos.";
        errors.push("CVV inválido");
    }

    // Si hay errores, mostrar los mensajes de error
    if (errors.length > 0) {
        return; // Evitar enviar el formulario
    } else {
        try {
            const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage

            const response = await fetch('http://localhost:3000/api/cards/addCard', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token // Incluir el token en el encabezado de la solicitud
                },
                body: JSON.stringify({ cardNumber, expireDate, cvv }),
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                // Aquí puedes agregar lógica adicional, como actualizar la UI para mostrar la nueva tarjeta
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error en el servidor');
        }
    }
});
