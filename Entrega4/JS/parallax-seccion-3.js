// Seleccionamos el contenedor y los personajes
const container = document.querySelector('.caracter-img-container3');
const characters = container.querySelectorAll('img');

// Función para manejar el movimiento del mouse
function handleMouseMove(e) {
    // Obtenemos la posición del mouse en el viewport
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculamos el porcentaje de la posición del mouse en la ventana
    const moveX = (mouseX - window.innerWidth / 2) / 20;
    const moveY = (mouseY - window.innerHeight / 2) / 20;
    
    // Movemos cada personaje
    characters.forEach((char, index) => {
        const depth = (index + 1) * 0.8;
        char.style.transform = `translate(${-moveX * depth}px, ${-moveY * depth}px) scale(1.05)`; // Scale reducido a 1.05
    });
}

// Agregamos los eventos
document.addEventListener('mousemove', handleMouseMove);

// Estilos necesarios
const style = document.createElement('style');
style.textContent = `
    .caracter-img-container3 {
        overflow: hidden;
    }
    
    .caracter-img-container3 img {
        transition: transform 0.2s ease-out;
        transform-origin: center center;
    }
`;
document.head.appendChild(style);

// Resetear la posición cuando el mouse sale de la ventana
document.addEventListener('mouseleave', () => {
    characters.forEach(char => {
        char.style.transform = 'translate(0, 0) scale(1.05)';
    });
});