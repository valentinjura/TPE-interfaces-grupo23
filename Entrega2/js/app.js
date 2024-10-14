document.querySelector('#signup-button').addEventListener('click', () => {
    // Obtener valores de los campos
    const nombre_apellido = document.querySelector('#name').value;
    const edad = document.querySelector('#age').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const repeat_password = document.querySelector('#repeat_password').value;
    const termsChecked = document.querySelector('#checkbox').checked;

    // Ocultar todos los mensajes de error inicialmente
    document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');

    let hasError = false; // Para rastrear si hay errores

    // Validar campos y mostrar mensajes de error
    if (!nombre_apellido) {
        document.getElementById('name-error').textContent = 'Por favor, completa tu nombre y apellido.';
        document.getElementById('name-error').style.display = 'block';
        hasError = true;
    }

    if (!edad) {
        document.getElementById('age-error').textContent = 'Por favor, completa tu edad.';
        document.getElementById('age-error').style.display = 'block';
        hasError = true;
    }

    if (!email) {
        document.getElementById('email-error').textContent = 'Por favor, completa tu email.';
        document.getElementById('email-error').style.display = 'block';
        hasError = true;
    }

    if (!password) {
        document.getElementById('password-error').textContent = 'Por favor, completa tu contraseña.';
        document.getElementById('password-error').style.display = 'block';
        hasError = true;
    }

    if (!repeat_password) {
        document.getElementById('repeat-error').textContent = 'Por favor, repite tu contraseña.';
        document.getElementById('repeat-error').style.display = 'block';
        hasError = true;
    }

    // Validar checkbox y mostrar mensaje de error
    if (!termsChecked) {
        document.getElementById('terms-error').textContent = 'Debes aceptar los términos y condiciones.';
        document.getElementById('terms-error').style.display = 'block';
        hasError = true;
    }

    // Manejar registro exitoso o errores
    if (!hasError) {
        console.log("Registro exitoso");

        // Mostrar loader
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        // Simular una espera (puedes reemplazar esto con la lógica real de registro)
        setTimeout(() => {
            loader.style.display = 'none';

            // Mostrar mensaje de éxito
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Registro completado con éxito.';
            successMessage.classList.add('success-message');
            document.querySelector('#signup-form').appendChild(successMessage);
            successMessage.style.display = 'block';

            setTimeout(() => {
                successMessage.style.display = 'none';
                document.querySelector('#signup-form').removeChild(successMessage);
            }, 3000);
        }, 2000); // Simula un retraso de 2 segundos
    } else {
        // Mensaje genérico que puedes mostrar si hay errores
        const message = document.createElement('div');
        message.textContent = 'Por favor, corrige los errores antes de continuar.';
        message.classList.add('error-message');
        document.body.appendChild(message);
        message.style.display = 'block';

        setTimeout(() => {
            message.style.display = 'none';
            document.body.removeChild(message);
        }, 3000);
    }
});
