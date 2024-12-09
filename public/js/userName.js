document.addEventListener('DOMContentLoaded', () => {
    const firstName = localStorage.getItem('firstName');
    if (firstName) {
        document.querySelector('.profile .user').textContent = firstName;
    } else {
        // Si el usuario no está autenticado, redirigir a la página de login
        window.location.href = 'login.html';
    }
});
