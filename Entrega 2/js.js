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

setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}, 5000);

updateCarousel();

document.querySelectorAll('.carrousel-container').forEach(container => {
    const cardWrapper = container.querySelector('.card-container');
    const cards = container.querySelectorAll('.container-cards');
    let currentIndex = 0;
    let cardsToShow = 2;
    const cardMargin = 10;

    const updateCarousel = () => {
        const cardWidth = cards[0].offsetWidth + cardMargin;
        const totalWidth = cards.length * cardWidth;
        const maxOffset = (cards.length - cardsToShow) * cardWidth;
        const offset = Math.min(currentIndex * cardWidth, maxOffset);

        cardWrapper.style.width = `${totalWidth}px`;

        cards.forEach((card, index) => {
            card.classList.remove('visible');
            card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            if (index === currentIndex) {
                card.classList.add('visible');
            } else {
                card.style.transform = 'translateY(10px) scale(0.95)';
                card.style.opacity = '0.7';
            }
        });

        cardWrapper.style.transform = `translateX(-${offset}px)`;

        setTimeout(() => {
            cards.forEach(card => {
                card.style.transition = '';
                card.style.transform = 'translateY(0) scale(1)';
                card.style.opacity = '1';
            });
        }, 300);
    };

    container.querySelector('.right-arrow').addEventListener('click', () => {
        if (currentIndex < cards.length - Math.floor(cardsToShow)) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    });

    container.querySelector('.left-arrow').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - Math.floor(cardsToShow);
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
                } else {
                    loadingOverlay.style.display = "none";
                }
            } else {
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

        const isCarritoVisible = carrito.style.display !== 'none';

        if (isCarritoVisible) {
            carritoBlack.style.display = 'none';
            addText.style.display = 'inline';
            removeText.style.display = 'none';
        } else {
            carritoBlack.style.display = 'block';
            addText.style.display = 'none';
            removeText.style.display = 'inline';
        }

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

        addCartButton.addEventListener('click', toggleCarrito);
        cartButton.addEventListener('click', toggleCarrito);
    }
});


