function checkScrollSeccion4() {
    const personajes = document.querySelectorAll('.personaje-info');
    const imagenes = document.querySelectorAll('.imagen-personaje');
    
    // Primero, quitar todas las clases activo
    imagenes.forEach(img => img.classList.remove('activo'));
    
    personajes.forEach(personaje => {
        const rect = personaje.getBoundingClientRect();
        const dataPersonaje = personaje.dataset.personaje;
        const imagen = document.querySelector(`.imagen-personaje[data-personaje="${dataPersonaje}"]`);
        
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibilityPercentage = (visibleHeight / elementHeight) * 100;

        if (visibilityPercentage > 50) {
            personaje.classList.add('activo');
            imagen.classList.add('activo');
        } else {
            personaje.classList.remove('activo');
        }
    });
}

// Optimización del scroll con requestAnimationFrame
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            checkScrollSeccion4();
            ticking = false;
        });
        ticking = true;
    }
});

// Intersection Observer para mejor rendimiento
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            checkScrollSeccion4();
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.personaje-info').forEach(el => observer.observe(el));

// Verificar al cargar la página
checkScrollSeccion4();