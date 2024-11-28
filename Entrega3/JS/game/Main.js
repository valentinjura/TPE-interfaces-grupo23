function loadMain() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let habilitado = true;
    let imagesLoaded = 0;
    let tiempo = 60;
    let enLinea = 4;

    // Cargamos todas las imagenes...
    //fondo del canvas
    const imgFondo = new Image();
    imgFondo.src = "IMG-GAME/fondo-tablero.jpg";

    //fichas (personajes)
    const imgJugador1Opcion1 = new Image();
    imgJugador1Opcion1.src = "IMG-GAME/batman.png";

    const imgJugador1Opcion2 = new Image();
    imgJugador1Opcion2.src = "IMG-GAME/nightwing.png";

    const imgJugador2Opcion1 = new Image();
    imgJugador2Opcion1.src = "IMG-GAME/joker.png";

    const imgJugador2Opcion2 = new Image();
    imgJugador2Opcion2.src = "IMG-GAME/harley.png";

    //fondo del tablero
    const imgTablero = new Image();
    imgTablero.src = "IMG-GAME/fondo-canva.webp";

    //"flechas"
    const imgArrow = new Image();
    imgArrow.src = "IMG-GAME/arrow.png";

    const imgArrowHover = new Image();
    imgArrowHover.src = "IMG-GAME/arrow-hover.png";

  


    //imagenes de menu y restart
    const homeMenu = new Image();
    homeMenu.src = "IMG-GAME/Home.png"

    const imgRestart = new Image();
    imgRestart.src = "IMG-GAME/Restart.png"

    const checkImagesLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded == 10) {
            iniciarMenu();
        }
    };

    function iniciarMenu() {
        // Fondo con gradiente
        const gradient = ctx.createLinearGradient(0, 0, 0, 750);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1205, 750);

        ctx.drawImage(imgFondo, 0, 0, canvas.width, canvas.height);
        
        drawTitulo(80);
        drawForm();
    }
   

    function drawTitulo(posy) {
        ctx.font = "bold 38px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#6366f1");   // Indigo
        gradient.addColorStop(0.5, "#8b5cf6"); // Purple
        gradient.addColorStop(1, "#ec4899");   // Pink
        
        ctx.shadowColor = "rgba(99, 102, 241, 0.6)";
        ctx.shadowBlur = 20;
        ctx.fillStyle = gradient;
        ctx.fillText("4 en linea: Batman vs Joker", canvas.width / 2, posy);
        ctx.shadowBlur = 0;
    }
    
    function drawForm() {
        // Modern glass morphism effect
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.shadowColor = "rgba(99, 102, 241, 0.2)";
        ctx.shadowBlur = 30;
        ctx.fillRect(300, 50, 600, 650);
        ctx.shadowBlur = 0;
    
        let posy = 150;
        drawSubtitulo(posy, "Elige el Tiempo deseado:", "#6366f1");
        posy += 150;
        drawSubtitulo(posy, "Modo de juego", "#8b5cf6");
        posy += 115;
        drawSubtitulo(posy, "elije tu equipo:", "#ec4899");
    
        timeButtons.forEach(button => drawTimeButton(button));
        xEnLineaButtons.forEach(button => drawXEnLineaButtons(button));
        fichasButtons.forEach(button => drawFichaButtons(button));
        drawButtonJugar();
    }
    
    function drawSubtitulo(posy, texto, color) {
        ctx.font = "bold 28px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = color;
        ctx.fillText(texto, canvas.width / 2, posy);
        ctx.shadowBlur = 0;
    }
    
    const buttonJugar = {
        x: 502.5,
        y: 600,
        width: 200,
        height: 50,
        color: "#10b981" // Emerald green
    };
    
    const timeButtons = [
        { x: 387.5, y: 170, width: 140, height: 50, color: "#1e293b", hover: "#334155", tiempo: 60, text: "1 min" },
        { x: 537.5, y: 170, width: 140, height: 50, color: "#1e293b", hover: "#334155", tiempo: 180, text: "3 min" },
        { x: 687.5, y: 170, width: 140, height: 50, color: "#1e293b", hover: "#334155", tiempo: 300, text: "5 min" }
    ];
    
    const xEnLineaButtons = [
        { x: 387.5, y: 310, width: 140, height: 50, color: "#1e293b", hover: "#334155", cant: 4, text: "4 en línea" },
        { x: 537.5, y: 310, width: 140, height: 50, color: "#1e293b", hover: "#334155", cant: 5, text: "5 en línea" },
        { x: 687.5, y: 310, width: 140, height: 50, color: "#1e293b", hover: "#334155", cant: 6, text: "6 en línea" }
    ];
    const fichasButtons = [
        { name: 0, x: 500, y: 460, radius: 35, img: imgJugador1Opcion1, isSelected: true },
        { name: 1, x: 500, y: 530, radius: 35, img: imgJugador1Opcion2, isSelected: false },
        { name: 2, x: 705, y: 460, radius: 35, img: imgJugador2Opcion1, isSelected: true },
        { name: 3, x: 705, y: 530, radius: 35, img: imgJugador2Opcion2, isSelected: false }
    ];

    // Create allButtonsMenu array combining all rectangular buttons
    const allButtonsMenu = [
        buttonJugar,
        ...timeButtons,
        ...xEnLineaButtons
    ];

    function drawButtonJugar() {
        const gradient = ctx.createLinearGradient(
            buttonJugar.x, 
            buttonJugar.y, 
            buttonJugar.x, 
            buttonJugar.y + buttonJugar.height
        );
        gradient.addColorStop(0, '#00FF00');  // Green
        gradient.addColorStop(1, '#00FF01');  // Slightly lighter green
    
        ctx.fillStyle = gradient;
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 15;
        
        // Remove the roundRect method and use standard fillRect
        ctx.fillRect(buttonJugar.x, buttonJugar.y, buttonJugar.width, buttonJugar.height);
        
        ctx.shadowBlur = 0;
    
        ctx.fillStyle = "white";
        ctx.font = "bold 24px 'Montserrat'sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Comenzar!", buttonJugar.x + buttonJugar.width/2, buttonJugar.y + 33);
    }

    function drawTimeButton(button) {
        ctx.fillStyle = tiempo === button.tiempo ? '#4a90e2' : '#2c3e50';
        ctx.fillRect(button.x, button.y, button.width, button.height);
    
        ctx.strokeStyle = tiempo === button.tiempo ? '#ffffff' : '#4a90e2';
        ctx.lineWidth = 2;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
    
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(button.text, button.x + button.width/2, button.y + 33);
    }
    function drawXEnLineaButtons(button) {
        ctx.fillStyle = enLinea === button.cant ? '#48bb78' : '#2c3e50';
        ctx.fillRect(button.x, button.y, button.width, button.height);
    
        ctx.strokeStyle = enLinea === button.cant ? '#ffffff' : '#48bb78';
        ctx.lineWidth = 2;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
    
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(button.text, button.x + button.width/2, button.y + 33);
    }

    function drawFichaButtons(button) {
        ctx.beginPath();
        ctx.arc(button.x, button.y, button.radius, 0, 2 * Math.PI);
        
        // Efecto de brillo para fichas seleccionadas
        if (button.isSelected) {
            ctx.shadowColor = "#4a90e2";
            ctx.shadowBlur = 15;
            ctx.globalAlpha = 1;
        } else {
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 0.5;
        }

        ctx.drawImage(
            button.img,
            button.x - button.radius,
            button.y - button.radius,
            button.radius * 2,
            button.radius * 2
        );
        
        // Borde para fichas seleccionadas
        if (button.isSelected) {
            ctx.strokeStyle = "#4a90e2";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.closePath();
    }

    //Se encarga de manejar el mouse pointer en los distintos botones del menú. Si el botón no se encuentra en ninguna posición posible (verificado con isPointerIn e isPoinInside), se establece el cursor por defecto.
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let cursorSet = false;

        for (let i = 0; i < allButtonsMenu.length; i++) {
            if (isPointerIn(allButtonsMenu[i], x, y)) {
                canvas.style.cursor = 'pointer';
                cursorSet = true;
                break;  // no nos mates F4bri, gracias 
            }
        }

        for (let i = 0; i < fichasButtons.length; i++) {
            if (isPointInside(fichasButtons[i], x, y)) {
                canvas.style.cursor = 'pointer';
                cursorSet = true;
                break;  // no nos mates F4bri, gracias 
            }
        }

        if (!cursorSet) {
            canvas.style.cursor = 'default';
        }
    })

    //Al clickear en las coordenadas posibles (según el botón utilizando isPointerIn o isPointInside), se ejecuta la accion correspondiente.
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (!habilitado) return; // Si no está habilitado, no ejecuta nada

        switch (true) {
            case isPointerIn(buttonJugar, x, y):
                iniciarJuego();
                break;

            case isPointerIn(xEnLineaButtons[0], x, y):
                enLinea = 4;
                iniciarMenu();
                break;

            case isPointerIn(xEnLineaButtons[1], x, y):
                enLinea = 5;
                iniciarMenu();
                break;

            case isPointerIn(xEnLineaButtons[2], x, y):
                enLinea = 6;
                iniciarMenu();
                break;

            break;

            case isPointerIn(timeButtons[0], x, y):
                tiempo = 60;
                iniciarMenu();
                break;

            case isPointerIn(timeButtons[1], x, y):
                tiempo = 180;
                iniciarMenu();
                break;

            case isPointerIn(timeButtons[2], x, y):
                tiempo = 300;
                iniciarMenu();
                break;

            case isPointInside(fichasButtons[0], x, y):
                fichasButtons[0].isSelected = true;
                fichasButtons[1].isSelected = false;
                iniciarMenu();
                break;

            case isPointInside(fichasButtons[1], x, y):
                fichasButtons[0].isSelected = false;
                fichasButtons[1].isSelected = true;
                iniciarMenu();
                break;

            case isPointInside(fichasButtons[2], x, y):
                fichasButtons[2].isSelected = true;
                fichasButtons[3].isSelected = false;
                iniciarMenu();
                break;

            case isPointInside(fichasButtons[3], x, y):
                fichasButtons[2].isSelected = false;
                fichasButtons[3].isSelected = true;
                iniciarMenu();
                break;
        }
    });

    //Se verifica la posición del mouse dentro de las coordenadas dadas para los botones rectangulares.
    function isPointerIn(button, x, y) {
        return x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height;
    }

    //Se verifica la posición del mouse dentro de las coordenadas dadas para los botones redondos.
    function isPointInside(button, x, y) {
        let _x = button.x - x;
        let _y = button.y - y;
        let resultado = Math.sqrt(_x * _x + _y * _y) < button.radius;
        return resultado;
    }


   
    function iniciarJuego() {
        let imgFichaJ1;
        let imgFichaJ2;
        habilitado = false;
    
        imgFichaJ1 = fichasButtons[0].isSelected ? imgJugador1Opcion1 : imgJugador1Opcion2;
        imgFichaJ2 = fichasButtons[2].isSelected ? imgJugador2Opcion1 : imgJugador2Opcion2;
    
        const game = new Game(ctx, canvas, imgFichaJ1, imgFichaJ2, tiempo, enLinea, true);
        
        game.setBackgroundImage(imgFondo);
        game.setHomeMenu(homeMenu);
        game.setFlechaRestart(imgRestart);
    
        // Wait for the board image to fully load before setting it
        if (imgTablero.complete) {
            game.tablero.imgTablero = imgTablero;
            game.tablero.imgArrow = imgArrow;
            game.tablero.imgArrowHover = imgArrowHover;
            game.draw();
        } else {
            imgTablero.onload = () => {
                game.tablero.imgTablero = imgTablero;
                game.tablero.imgArrow = imgArrow;
                game.tablero.imgArrowHover = imgArrowHover;
                game.draw();
            };
        }
    
        if (!habilitado) {
            canvas.addEventListener('mousedown', (e) => {
                game.seleccionarFicha(e.offsetX, e.offsetY);
                if (game.fichaSeleccionada == null) {
                    game.reiniciarJuego(e.offsetX, e.offsetY);
                    game.volverAlMenu(e.offsetX, e.offsetY);
                }
            });
    
            canvas.addEventListener('mousemove', (e) => {
                game.moverFicha(e.offsetX, e.offsetY);
                if (game.fichaSeleccionada != null) {
                    const rect = canvas.getBoundingClientRect();
                    const mousePosX = e.clientX - rect.left;
                    const mousePosY = e.clientY - rect.top;
                    game.tablero.drawZonaCaida(mousePosX, mousePosY);
                }
                if (
                    game.isFichasSeleccionadas(e.offsetX, e.offsetY) ||
                    game.isPointerOnMenuButton(e.offsetX, e.offsetY) ||
                    game.isPointerOnResetButton(e.offsetX, e.offsetY)) {
                    canvas.style.cursor = 'pointer';
                } else {
                    canvas.style.cursor = 'default';
                }
            });
    
            canvas.addEventListener('mouseup', (e) => {
                game.soltarFicha(e.offsetX, e.offsetY);
            });
        }
    }
    
    imgJugador1Opcion1.onload = checkImagesLoaded;
    imgJugador1Opcion2.onload = checkImagesLoaded;
    imgJugador2Opcion1.onload = checkImagesLoaded;
    imgJugador2Opcion2.onload = checkImagesLoaded;
    imgTablero.onload = checkImagesLoaded;
    imgFondo.onload = checkImagesLoaded;
    homeMenu.onload = checkImagesLoaded;
    imgRestart.onload = checkImagesLoaded;
    imgArrow.onload = checkImagesLoaded;
    imgArrowHover.onload = checkImagesLoaded;
}

document.addEventListener("DOMContentLoaded", loadMain());