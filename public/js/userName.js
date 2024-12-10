document.addEventListener('DOMContentLoaded', () => {
    const firstName = localStorage.getItem('firstName');
    if (firstName) {
        document.querySelector('.profile .user').textContent = firstName;
    } else {
        //window.location.href = 'login.html';
    }
});
