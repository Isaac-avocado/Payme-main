document.querySelectorAll('.period-selector').forEach(selector => {
    const options = selector.querySelectorAll('.period-option');
    
    options.forEach(option => {
        option.addEventListener('click', function () {
            options.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
