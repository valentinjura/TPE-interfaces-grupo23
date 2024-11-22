'use strict'
/*sección uno*/

const slides = document.querySelectorAll('.slideshow .slide');
let currentIndex = 0;

function changeSlide() {

    slides[currentIndex].classList.remove('active1');
    
    // Incrementar el índice para la siguiente imagen
    currentIndex = (currentIndex + 1) % slides.length;
    
    // Añadir la clase 'active' a la siguiente imagen
    slides[currentIndex].classList.add('active1');
}

// Cambiar la imagen cada 3 segundos
setInterval(changeSlide, 3000);

/*sección dos*/

document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.content-info-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Porcentaje de elemento visible para activar
    });

    containers.forEach(container => {
        observer.observe(container);
    });
});



document.querySelector('.sprite-container').addEventListener('click', function() {
    const sprite = document.querySelector('.sprite');
    sprite.classList.toggle('paused');
});

// Aquí puedes añadir la clase 'paused' para detener la animación cuando haces clic en el contenedor
