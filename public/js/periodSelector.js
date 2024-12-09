document.querySelectorAll('.period-selector').forEach(selector => {
    const options = selector.querySelectorAll('.period-option');
    
    options.forEach(option => {
        option.addEventListener('click', function () {
            // Remover la clase activa solo de las opciones en esta tarjeta
            options.forEach(opt => opt.classList.remove('active'));
            // Agregar la clase activa a la opción seleccionada
            this.classList.add('active');
        });
    });
});
