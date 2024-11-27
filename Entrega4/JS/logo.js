document.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    const logo = document.querySelector(".logo-numberBlocks");
    
    const threshold = 50; 
    
    if (window.scrollY > threshold) {
        logo.classList.add('scrolled');
    } else {
        logo.classList.remove('scrolled');
    }

})
  