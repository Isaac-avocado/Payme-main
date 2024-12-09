function logout() {
    localStorage.removeItem('token');
    window.location.href = '/src/views/login.html';
}