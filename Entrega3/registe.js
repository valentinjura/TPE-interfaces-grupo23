document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const form = document.querySelector(".signup-form");
    const successMessage = document.querySelector(".success-message");
    const errorMessages = {
        name: document.getElementById('name-error'),
        age: document.getElementById('age-error'),
        email: document.getElementById('email-error'),
        password: document.getElementById('password-error'),
        repeatPassword: document.getElementById('repeat-password-error'),
        checkbox: document.querySelector('.terminos .error-message')
    };

    // Manejo de enlaces
    links.forEach(link => {
        link.addEventListener("click", event => {
            const targetUrl = link.href;

            // Verificar si el enlace es un ancla en la misma página
            if (targetUrl.includes("#") && link.pathname === window.location.pathname) {
                event.preventDefault();
                const anchorId = targetUrl.substring(targetUrl.indexOf("#"));
                const targetElement = document.querySelector(anchorId);

                if (targetElement) {
                    loadingOverlay.style.display = "flex";
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        loadingOverlay.style.display = "none";
                    }, 3000);
                }
            } else {
                // Muestra el overlay antes de redirigir a otra página
                event.preventDefault();
                loadingOverlay.style.display = "flex";

                // Redirige después de un pequeño retraso
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 1000);
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        // Limpiar mensajes de error previos
        Object.values(errorMessages).forEach(msg => msg.style.display = 'none');
        successMessage.style.display = 'none';

        let isValid = true;

        // Validar cada campo requerido
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeat_password').value;
        const checkbox = document.getElementById('checkbox').checked;

        if (!name) {
            errorMessages.name.style.display = 'block';
            isValid = false;
        }

        if (!age) {
            errorMessages.age.style.display = 'block';
            isValid = false;
        }

        if (!email) {
            errorMessages.email.style.display = 'block';
            isValid = false;
        }

        if (!password) {
            errorMessages.password.style.display = 'block';
            isValid = false;
        }

        if (password !== repeatPassword) {
            errorMessages.repeatPassword.style.display = 'block';
            isValid = false;
        }

        if (!checkbox) {
            errorMessages.checkbox.style.display = 'block';
            isValid = false;
        }

        // Si todo es válido, mostrar el mensaje de éxito y el spinner
        if (isValid) {
            successMessage.style.display = 'block';
            form.reset(); // Reinicia el formulario

            // Muestra el overlay de carga
            loadingOverlay.style.display = "flex";

            // Redirigir después de 3 segundos
            setTimeout(() => {
                window.location.href = "index.html"; // Cambia esto a la URL de tu página de inicio
            }, 3000);

            // Ocultar el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    });
});