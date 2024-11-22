// Seleccionamos el contenedor y los personajes
const container = document.querySelector('.caracter-img-container3');
const characters = container.querySelectorAll('img');


function handleMouseMove(e) {
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    
    const moveX = (mouseX - window.innerWidth / 2) / 20;
    const moveY = (mouseY - window.innerHeight / 2) / 20;
    
   
    characters.forEach((char, index) => {
        const depth = (index + 1) * 0.8;
        char.style.transform = `translate(${-moveX * depth}px, ${-moveY * depth}px) scale(1.05)`; 
    });
}

//eventos
document.addEventListener('mousemove', handleMouseMove);


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


document.addEventListener('mouseleave', () => {
    characters.forEach(char => {
        char.style.transform = 'translate(0, 0) scale(1.05)';
    });
});
