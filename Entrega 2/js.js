window.onload = () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('show');
        });
    }
};

let images = [
    {
        "url": "Imagenes/carrousel/halo.png",
    },
    {
        "url": "Imagenes/carrousel/wukong.png",
    },
    {
        "url": "Imagenes/carrousel/the-legend-of-zelda.png",
    },
];

let prevButton = document.getElementById('prev-button');
let nextButton = document.getElementById('next-button');
let carouselImage = document.getElementById('carousel-image');
let currentIndex = 0;

function updateCarousel() {
    const currentImage = document.querySelector('.carousel-item');
    const currentCaption = document.querySelector('.carousel-caption');

    if (currentImage) {
        currentImage.classList.add('hide');
    }
    if (currentCaption) {
        currentCaption.classList.add('hide');
    }

    setTimeout(() => {
        carouselImage.innerHTML = `<img class="carousel-item" src="${images[currentIndex].url}" alt="imagen" loading="lazy">
            <div class="carousel-caption">
                <button class="caption-button">
                    <a href="#">PROXIMAMENTE</a>
                </button>
            </div>`;

        const newImage = document.querySelector('.carousel-item');
        const newCaption = document.querySelector('.carousel-caption');

        newImage.classList.remove('hide');
        newCaption.classList.remove('hide');
    }, 300);
}

prevButton.addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
});

nextButton.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
});

// Cambia automáticamente cada 5 segundos
setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}, 5000);

// Inicializa el carrusel al cargar
updateCarousel();


document.querySelectorAll('.carrousel-container').forEach(container => {
    const cardWrapper = container.querySelector('.card-container');
    const cards = container.querySelectorAll('.container-cards');
    let currentIndex = 0;
    let cardsToShow = 2;
    const cardMargin = 10;

    const updateCarousel = () => {
        const cardWidth = cards[0].offsetWidth + cardMargin; // Incluye el margen
        const totalWidth = cards.length * cardWidth; // Ancho total del carrusel
        const maxOffset = (cards.length - cardsToShow) * cardWidth; // Máximo desplazamiento permitido
        const offset = Math.min(currentIndex * cardWidth, maxOffset); // Asegúrate de no exceder el máximo

        // Ajusta el ancho del cardWrapper
        cardWrapper.style.width = `${totalWidth}px`;

        // Aplicar la clase visible a la tarjeta actual
        cards.forEach((card, index) => {
            card.classList.remove('visible'); // Elimina la clase de visibilidad
            card.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Reduce la duración
            if (index === currentIndex) {
                card.classList.add('visible'); // Solo la tarjeta actual es visible
            } else {
                card.style.transform = 'translateY(10px) scale(0.95)'; // Efecto sutil de desplazamiento
                card.style.opacity = '0.7'; // Menos opacidad
            }
        });

        cardWrapper.style.transform = `translateX(-${offset}px)`;

        // Restablecer la posición y opacidad después de la transición
        setTimeout(() => {
            cards.forEach(card => {
                card.style.transition = ''; // Quitar la transición para la siguiente animación
                card.style.transform = 'translateY(0) scale(1)'; // Regresar a la posición original
                card.style.opacity = '1'; // Hacerlas visibles
            });
        }, 300); // Sincronizado con la duración de la transición
    };

    container.querySelector('.right-arrow').addEventListener('click', () => {
        if (currentIndex < cards.length - Math.floor(cardsToShow)) {
            currentIndex++;
        } else {
            currentIndex = 0; // Regresar al inicio
        }
        updateCarousel();
    });
    
    container.querySelector('.left-arrow').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - Math.floor(cardsToShow); // Llevar al final
        }
        updateCarousel();
    });

    const adjustCardsToShow = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            cardsToShow = 1.4;
        } else if (screenWidth < 1024) {
            cardsToShow = 2;
        } else {
            cardsToShow = 4.5;
        }
        updateCarousel();
    };

    window.addEventListener('resize', adjustCardsToShow);
    adjustCardsToShow();
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a");
    const loadingOverlay = document.getElementById("loadingOverlay");

    links.forEach(link => {
        link.addEventListener("click", event => {
            const targetUrl = link.href;

            // Comprobar si el enlace es un ancla dentro de la misma página
            if (targetUrl.includes("#") && link.pathname === window.location.pathname) {
                event.preventDefault();
                const anchorId = targetUrl.substring(targetUrl.indexOf("#"));
                console.log("Enlace clicado:", anchorId); // Verifica el ID que estás capturando

                const targetElement = document.querySelector(anchorId);

                if (targetElement) {
                    console.log("Elemento objetivo encontrado:", targetElement); // Confirma que el elemento objetivo existe
                    loadingOverlay.style.display = "flex";
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        loadingOverlay.style.display = "none";
                    }, 3000);
                } else {
                    console.log("Elemento objetivo no encontrado");
                    loadingOverlay.style.display = "none";
                }
            } else {
                // Si es un enlace externo o sin ancla
                loadingOverlay.style.display = "flex";
            }
        });
    });
});


document.querySelectorAll('.container-game-card').forEach(card => {
    const addCartButton = card.querySelector('.add-cart-button');
    const cartButton = card.querySelector('.cart-button');
    
    if (addCartButton && cartButton) {
        const carrito = card.querySelector('.carrito');
        const carritoBlack = card.querySelector('.carrito-black');
        const addText = card.querySelector('.add-text');
        const removeText = card.querySelector('.remove-text');

        // Inicializa el estado basado en la visibilidad del carrito
        const isCarritoVisible = carrito.style.display !== 'none';
        
        // Cambia el estado inicial según el HTML
        if (isCarritoVisible) {
            carritoBlack.style.display = 'none';
            addText.style.display = 'inline';
            removeText.style.display = 'none';
        } else {
            carritoBlack.style.display = 'block';
            addText.style.display = 'none';
            removeText.style.display = 'inline';
        }

        // Función para alternar el estado del carrito
        const toggleCarrito = () => {
            if (carrito.style.display === 'none') {
                carrito.style.display = 'block';
                carritoBlack.style.display = 'none';
                addText.style.display = 'inline';
                removeText.style.display = 'none';
            } else {
                carrito.style.display = 'none';
                carritoBlack.style.display = 'block';
                addText.style.display = 'none';
                removeText.style.display = 'inline';
            }
        };

        // Evento para cambiar el estado al hacer clic en el botón de agregar
        addCartButton.addEventListener('click', toggleCarrito);

        // Evento para cambiar el estado al hacer clic en el icono del carrito
        cartButton.addEventListener('click', toggleCarrito);
    }
});
