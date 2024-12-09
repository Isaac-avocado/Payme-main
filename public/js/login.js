document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const showLoginBtn = document.getElementById('show-login');
    const showRegisterBtn = document.getElementById('show-register');
    const sectionText = document.querySelector('.section-text');
    const whiteShape = document.querySelector('.white-shape');

    // Cambiar entre Login y Sign Up
    showLoginBtn.addEventListener('click', () => {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
        showLoginBtn.classList.add('active');
        showRegisterBtn.classList.remove('active');
        sectionText.textContent = 'LOGIN';
        whiteShape.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    });

    showRegisterBtn.addEventListener('click', () => {
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('login-form').classList.add('hidden');
        showRegisterBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
        sectionText.textContent = 'SIGN UP';
        whiteShape.style.transform = 'translate(-50%, -50%) rotate(180deg)';
    });

    // Validaciones para el formulario de registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fields = [
            {
                element: document.getElementById('names'),
                message: 'Only letters are allowed in First Name.',
                isValid: (value) => /^[a-zA-Z\s]+$/.test(value.trim()),
            },
            {
                element: document.getElementById('lastnames'),
                message: 'Only letters are allowed in Last Name.',
                isValid: (value) => /^[a-zA-Z\s]+$/.test(value.trim()),
            },
            {
                element: document.getElementById('email-register'),
                message: 'Enter a valid email address.',
                isValid: (value) => /\S+@\S+\.\S+/.test(value.trim()),
            },
            {
                element: document.getElementById('password-register'),
                message: 'Password must be at least 8 characters long.',
                isValid: (value) => value.length >= 8,
            },
        ];

        let isFormValid = true;

        fields.forEach(({ element, message, isValid }) => {
            const value = element.value;
            const inputGroup = element.parentElement; // Contenedor del input
            const errorMessage = inputGroup.querySelector('.error-message');

            if (!isValid(value)) {
                inputGroup.classList.add('invalid');
                errorMessage.textContent = message;
                isFormValid = false;
            } else {
                inputGroup.classList.remove('invalid');
                errorMessage.textContent = '';
            }
        });

        if (isFormValid) {
            const first_name = document.getElementById('names').value;
            const last_name = document.getElementById('lastnames').value;
            const email = document.getElementById('email-register').value;
            const password = document.getElementById('password-register').value;

            try {
                const response = await fetch('http://localhost:3000/api/user/register', 
                    { method: 'POST', headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ first_name, last_name, email, password }), 
                    credentials: 'include'
                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = 'login.html'; // Redirigir solo si se registra exitosamente
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Error en el servidor');
            }
        }
    });

    // Validaciones para el formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email-login').value;
        const password = document.getElementById('password-login').value;

        const emailGroup = document.getElementById('email-login').parentElement; 
        const passwordGroup = document.getElementById('password-login').parentElement;

        const emailError = emailGroup.querySelector('.error-message');
        const passwordError = passwordGroup.querySelector('.error-message');

        let isFormValid = true;

        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            emailGroup.classList.add('invalid');
            emailError.textContent = 'Enter a valid email address.';
            isFormValid = false;
        } else {
            emailGroup.classList.remove('invalid');
            emailError.textContent = '';
        }

        if (password.length < 8) {
            passwordGroup.classList.add('invalid');
            passwordError.textContent = 'Password must be at least 8 characters long.';
            isFormValid = false;
        } else {
            passwordGroup.classList.remove('invalid');
            passwordError.textContent = '';
        }

        if (isFormValid) {
            try {
                const response = await fetch('http://localhost:3000/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                });                
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('firstName', result.firstName);
                    window.location.href = 'dashboard.html'; // Redirigir solo si el login es exitoso
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Error en el servidor');
            }
        }
    });
});
