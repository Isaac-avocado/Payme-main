document.getElementById('card-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    let cardNumber = document.getElementById('card-number').value;
    let expireDate = document.getElementById('expire-date').value;
    let cvv = document.getElementById('cvv').value;

    let errors = [];

    // debug
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

    if (errors.length > 0) {
        return; 
    } else {
        try {
            const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage

            const response = await fetch('http://localhost:3000/api/cards/addCard', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token 
                },
                body: JSON.stringify({ cardNumber, expireDate, cvv }),
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error en el servidor');
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const cardNumberInput = document.getElementById('card-number');
    const expireDateInput = document.getElementById('expire-date');
    const cvvInput = document.getElementById('cvv');
    const cardForm = document.getElementById('card-form');

    // Permitir solo números en los campos
    function allowOnlyNumbers(event) {
        const key = event.key;
        if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'Tab') {
            event.preventDefault();
        }
    }

    // Formatear automáticamente la fecha de expiración a MM/YY
    function formatExpirationDate(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remover caracteres no numéricos

        if (value.length > 4) {
            value = value.slice(0, 4); // Limitar a 4 dígitos
        }

        if (value.length > 2) {
            input.value = `${value.slice(0, 2)}/${value.slice(2)}`;
        } else {
            input.value = value;
        }
    }

    // Validación para no permitir más de la longitud máxima
    function enforceMaxLength(event, maxLength) {
        const input = event.target;
        if (input.value.length >= maxLength && event.key !== 'Backspace' && event.key !== 'Tab') {
            event.preventDefault();
        }
    }

    // Limpiar los campos del formulario
    function clearFormFields() {
        cardNumberInput.value = '';
        expireDateInput.value = '';
        cvvInput.value = '';
    }

 
    cardNumberInput.addEventListener('keypress', allowOnlyNumbers);
    cardNumberInput.addEventListener('input', (event) => enforceMaxLength(event, 16));

    expireDateInput.addEventListener('keypress', allowOnlyNumbers);
    expireDateInput.addEventListener('input', formatExpirationDate);

    cvvInput.addEventListener('keypress', allowOnlyNumbers);
    cvvInput.addEventListener('input', (event) => enforceMaxLength(event, 3));

    cardForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        clearFormFields();
    });
});

