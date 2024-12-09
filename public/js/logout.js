function logout() {
    // Lógica para cerrar sesión (por ejemplo, eliminar el token del localStorage)
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = '/src/views/login.html';
}