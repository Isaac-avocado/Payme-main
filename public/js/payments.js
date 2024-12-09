document.addEventListener("DOMContentLoaded", function () {
    const cardInputs = document.querySelectorAll(".card-input");
    const userInput = document.querySelector(".user-input");
    const paymentMethod = document.getElementById("payment-method");

    function toggleInputFields() {
        if (paymentMethod.value === "card") {
            cardInputs.forEach(input => input.style.display = "block");
            userInput.style.display = "none";
        } else if (paymentMethod.value === "user") {
            cardInputs.forEach(input => input.style.display = "none");
            userInput.style.display = "block";
        }
    }

    paymentMethod.addEventListener("change", toggleInputFields);
    toggleInputFields();

    document.getElementById("transfer-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        let valid = true;

        // Validar monto
        const amount = document.getElementById("amount");
        if (amount.value === "" || isNaN(amount.value) || amount.value <= 0) {
            showError(amount, "Please enter a valid amount.");
            valid = false;
        } else {
            hideError(amount);
        }

        // Preparar datos para envío
        let data = { amount: amount.value };

        if (paymentMethod.value === "card") {
            const cardNumber = document.getElementById("end-card");
            if (!/^\d{16}$/.test(cardNumber.value)) {
                showError(cardNumber, "The card number must be 16 digits long.");
                valid = false;
            } else {
                hideError(cardNumber);
            }

            const ownCard = document.getElementById("own-card");
            if (!/^\d{16}$/.test(ownCard.value)) {
                showError(ownCard, "The own card number must be 16 digits long.");
                valid = false;
            } else {
                hideError(ownCard);
            }

            if (valid) {
                data = {
                    ...data,
                    ownCard: ownCard.value,
                    endCard: cardNumber.value,
                    description: document.getElementById("description").value
                };
                await transferFunds('/api/payments/transferBetweenCards', data);
            }
        } else if (paymentMethod.value === "user") {
            const email = document.getElementById("email");
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email.value)) {
                showError(email, "Please enter a valid email address.");
                valid = false;
            } else {
                hideError(email);
            }

            if (valid) {
                data = {
                    ...data,
                    email: email.value,
                    description: document.getElementById("description").value
                };
                await transferFunds('/api/payments/transferBetweenUsers', data);
            }
        }
    });

    function showError(input, message) {
        const errorMessage = input.nextElementSibling;
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        input.style.borderColor = "#e74c3c";
    }

    function hideError(input) {
        const errorMessage = input.nextElementSibling;
        errorMessage.style.display = "none";
        input.style.borderColor = "#ddd";
    }

    async function transferFunds(url, data) {
        try {
            const token = localStorage.getItem('token'); // Asegúrate de que el token esté en localStorage
            if (!token) {
                throw new Error('Token not found');
            }
    
            const response = await fetch(`http://localhost:3000${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token, // Envía el token en el encabezado Authorization
                },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error in transaction: ' + error.message);
        }
    }
    
    

    // Validar números de tarjeta
    document.getElementById('end-card').addEventListener('input', function (e) {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, ''); // Remover caracteres no numéricos
        e.target.value = value; // Actualizar el valor del input
    });

    document.getElementById('own-card').addEventListener('input', function (e) {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, ''); // Remover caracteres no numéricos
        if (value.length > 16) {
            value = value.slice(0, 16); // Limitar a 16 dígitos
        }
        e.target.value = value; // Actualizar el valor del input
    });

    // Validar solo números en el campo de monto
    document.getElementById('amount').addEventListener('input', function (e) {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, ''); // Remover caracteres no numéricos
        e.target.value = value; // Actualizar el valor del input
    });
});
