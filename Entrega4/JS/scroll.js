/*sección cinco*/

/*función que logra que haya desplazamiento a diferentes velocidades entre video y personaje*/

function checkScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150; // Adjust this value to control when the reveal happens
        
        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active2');
        } else {
            reveal.classList.remove('active2');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', checkScroll);

// Initial check on page load
checkScroll();


document.addEventListener('DOMContentLoaded', () => {
    const sceneContainer = document.querySelector('.scene-container');
    const elements = {
        trees: document.querySelectorAll('.tree'),
        bushes: document.querySelectorAll('.bush'),
        rocks: document.querySelectorAll('.rock'),
        characters: document.querySelectorAll('.character'),
        logo: document.querySelector('.logo')
    };

    let ticking = false;
    let hasScrolled = false;

    function updateAnimations() {
        if (!hasScrolled) {
            return;
        }

        const scrollY = window.scrollY;
        const sceneRect = sceneContainer.getBoundingClientRect();
        const sceneTop = sceneRect.top;
        const scrollProgress = Math.max(0, Math.min(1, -sceneTop / (window.innerHeight * 0.5)));


        // Movimiento controlado para el fondo
        if (scrollProgress > 0) {
            sceneContainer.style.transform = `translateY(${scrollY * 0.3}px)`;  // Fondo moviéndose suave
        } else {
            sceneContainer.style.transform = '';  // Resetear si no hay scroll
        }

        if (scrollProgress > 0) {
            // Ajustar la velocidad del movimiento de los árboles (hacerlos más lentos)
            const moveFactor = 0.5;  // Reducir la velocidad general para los elementos
            const leftTree = document.querySelector('.tree-left-1');
            const rightTree1 = document.querySelector('.tree-right-1');
            const rightTree2 = document.querySelector('.tree-right-2');

            if (leftTree) {
                leftTree.style.transform = `translateX(${-scrollProgress * window.innerWidth * 0.1 * moveFactor}px)`;  // Reducir velocidad
            }

            if (rightTree1) {
                rightTree1.style.transform = `translateX(${scrollProgress * window.innerWidth * 0.1 * moveFactor}px)`;  // Reducir velocidad
            }

            if (rightTree2) {
                rightTree2.style.transform = `translateX(${scrollProgress * window.innerWidth * 0.08 * moveFactor}px)`;  // Reducir velocidad
            }

            // Ajustar la velocidad del movimiento de los arbustos
            elements.bushes.forEach((bush) => {
                const isLeft = bush.classList.contains('bush-1') || bush.classList.contains('bush-2');
                const direction = isLeft ? -1 : 1;
                const distance = window.innerWidth * 0.1;  // Reducir distancia
                bush.style.transform = `translateX(${direction * scrollProgress * distance * moveFactor}px)`;  // Lento
            });

            // Ajustar la velocidad del movimiento de las rocas
            elements.rocks.forEach((rock) => {
                const isLeft = rock.classList.contains('rock-1');
                const direction = isLeft ? -1 : 1;
                const distance = window.innerWidth * 0.1;  // Reducir distancia
                rock.style.transform = `translateX(${direction * scrollProgress * distance * moveFactor}px)`;  // Lento
            });

            // Ajustar la velocidad del movimiento de los personajes, y restringir dentro del contenedor
            elements.characters.forEach((character) => {
                // Asegurarse de que el personaje no se salga del contenedor
                const containerHeight = sceneContainer.offsetHeight;  // Altura del contenedor
                const characterHeight = character.offsetHeight;  // Altura del personaje
                const maxTranslateY = containerHeight - characterHeight;  // Limitar el movimiento a la altura del contenedor

                // Movimiento hacia arriba (cambiar de 'scrollProgress * 0' a algo positivo para subir)
                const translateY = Math.min(scrollProgress * 30 * moveFactor, maxTranslateY);  // Limite para no salirse del contenedor
                const opacity = 1;  // Mantener la opacidad en 1

                character.style.transform = `translateY(${-translateY}px)`;  // Mover hacia arriba (negativo)
                character.style.opacity = opacity;  // Mantener la opacidad
            });

            // Logo: ajustar velocidad
            if (elements.logo) {
                const scale = 1 - (scrollProgress * 0.1 * moveFactor);  // Escala más lenta
                const opacity = 1 - scrollProgress * 0.4 * moveFactor;  // Opacidad más lenta
                elements.logo.style.transform = `translate(-50%, 0) scale(${scale})`;
                elements.logo.style.opacity = opacity;
            }
        } else {
            // Resetear a posiciones iniciales
            resetPositions();
        }

        ticking = false;
    }

    function resetPositions() {
        elements.trees.forEach(tree => {
            tree.style.transform = '';
        });

        elements.bushes.forEach(bush => {
            bush.style.transform = '';
        });

        elements.rocks.forEach(rock => {
            rock.style.transform = '';
        });

        elements.characters.forEach(character => {
            character.style.transform = '';
            character.style.opacity = '1';
        });

        if (elements.logo) {
            elements.logo.style.transform = 'translate(-50%, 0)';
            elements.logo.style.opacity = '1';
        }
    }

    function onScroll() {
        if (!hasScrolled) {
            hasScrolled = true;
        }

        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateAnimations();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Asegurar posiciones iniciales al cargar
    resetPositions();

    // Crear contenedor de scroll si no existe
    if (!document.querySelector('.scroll-container')) {
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';
        sceneContainer.parentNode.insertBefore(scrollContainer, sceneContainer);
        scrollContainer.appendChild(sceneContainer);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateAnimations, { passive: true });
});
