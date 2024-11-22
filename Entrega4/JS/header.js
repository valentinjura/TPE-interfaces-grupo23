document.addEventListener('DOMContentLoaded', function() {
    const headerFixed = document.querySelector('.header-fixed');
    const headerLogo = headerFixed.querySelector('.header-logo');
    const hamburgers = document.querySelectorAll('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
    const heroLogo = document.querySelector('.logo');
    let lastScroll = 0;

    // Función para alternar el menú
    function toggleMenu() {
        hamburgers.forEach(hamburger => {
            hamburger.classList.toggle('active');
        });
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

   
    hamburgers.forEach(hamburger => {
        hamburger.addEventListener('click', toggleMenu);
    });

    menuOverlay.addEventListener('click', toggleMenu);

    // Event listener para el scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            headerFixed.classList.add('visible');
        } else {
            headerFixed.classList.remove('visible');
        }

        if (heroLogo) {
            const heroLogoRect = heroLogo.getBoundingClientRect();
            if (heroLogoRect.bottom < 0) {
                headerLogo.classList.add('visible');
            } else {
                headerLogo.classList.remove('visible');
            }
        }

        lastScroll = currentScroll;
    });

    // Cerrar menú 
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});
