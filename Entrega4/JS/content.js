'use strict'
/*sección uno*/

const slides = document.querySelectorAll('.slideshow .slide');
let currentIndex = 0;

function changeSlide() {

    slides[currentIndex].classList.remove('active1');
    
 
    currentIndex = (currentIndex + 1) % slides.length;
 
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
        threshold: 0.1 
    });

    containers.forEach(container => {
        observer.observe(container);
    });
});




document.addEventListener('DOMContentLoaded', function() {
   
    window.addEventListener('load', function() {
      const loader = document.querySelector('.loader-container');
      const content = document.querySelector('.content');
      
      
      setTimeout(() => {
       
        loader.classList.add('hidden');
        
        
        
        setTimeout(() => {
          loader.remove();
        }, 500);
      }, 3000);
    });
  });


