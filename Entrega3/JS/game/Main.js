'use strict';
import { Juego } from './Juego.js';


document.addEventListener('DOMContentLoaded', () => {
    const formLineas = document.getElementById('formLineas');
    const elementsPortada = document.getElementById('elementsPortada');
    const btnChangeScreen = document.getElementById('changeScreen');
    const msjError = document.getElementById('msjError');
    const selectEquipo1 = document.getElementById('equipo1');
    const selectEquipo2 = document.getElementById('equipo2');

    // Verificar si todos los elementos existen antes de usarlos
    if (!formLineas || !elementsPortada || !btnChangeScreen || !msjError || !selectEquipo1 || !selectEquipo2) {
        console.error('Error: Elementos HTML no encontrados.');
        return;
    }

    // Botón para cambiar de pantalla
    btnChangeScreen.addEventListener('click', () => {
        elementsPortada.classList.add('taparJuego'); // Ocultar portada
        formLineas.classList.remove('taparJuego');  // Mostrar formulario
    });

    // Evento submit del formulario
    formLineas.addEventListener('submit', (event) => {
        event.preventDefault();

        const equipo1 = selectEquipo1.value; // Valor del primer equipo
        const equipo2 = selectEquipo2.value; // Valor del segundo equipo

        // Validación de equipos
        if (equipo1 !== equipo2 && equipo1 !== "" && equipo2 !== "") {
            const tipoSeleccionado = document.querySelector('input[name="tipo"]:checked');

            // Validar que se haya seleccionado un tipo de juego
            if (!tipoSeleccionado) {
                msjError.textContent = "Seleccione una cantidad de líneas para jugar.";
                msjError.classList.remove('taparJuego');
                return;
            }

            const cantidadEnLinea = parseInt(tipoSeleccionado.value);

            // Crear instancia del juego
            const juego = new Juego(cantidadEnLinea);
            msjError.classList.add('taparJuego'); // Ocultar mensajes de error
            juego.cambiarPantallas();
            juego.initGame();
        } else {
            msjError.textContent = "¡Los equipos deben ser diferentes!";
            msjError.classList.remove('taparJuego'); // Mostrar mensaje de error
        }
    });
});
