class Game {
    constructor(ctx, canvas, imgJugador1, imgJugador2, tiempo, xEnLinea, habilitado) {
        this.nombre = "juego";
        this.ctx = ctx;
        this.canvas = canvas;
        this.tiempo = tiempo;
        this.xEnLinea = xEnLinea;
        this.tablero = new Tablero(ctx, xEnLinea, 70);
        this.imgJugador1 = imgJugador1;
        this.imgJugador2 = imgJugador2;
        this.fichasJugador1 = [];
        this.fichasJugador2 = [];
        this.timer = new Timer(tiempo, ctx, this);
        this.jugadorActual = 1;
        this.fichaSeleccionada = null;
        this.isMouseDown = false;
        this.backgroundImage;
        this.habilitado = habilitado;
        this.homeMenu;
        this.flechaRestart;
        // Crea fichas para ambos jugadores
        this.inicializarFichas();
        this.fichasTotales = this.fichasJugador1.length + this.fichasJugador2.length;
        this.fichasSoltadas = 0;
    }

    // Crea las fichas para ambos jugadores teniendo en cuenta el tablero y su tamaño, espacios entre ellas, tamaño de las fichas y la imagen de las fichas.
    inicializarFichas() {
        const fichasXJugador = (this.tablero.getColumnas() * this.tablero.getFilas()) / 2;
        const canvasWidth = this.canvas.width;
        const tableroWidth = this.tablero.getColumnas() * this.tablero.getTamanoCelda();
        const startX = (canvasWidth - tableroWidth) / 2;

        const distFromBoard = 70;
        const columnSpacing = 60;
        const posicionXJugador1Base = startX - distFromBoard;
        const posicionXJugador2Base = startX + tableroWidth + distFromBoard;

        let numColumns = 1;
        let espacioVertical = 30;
        let posicionYInicial = 100;

        if (fichasXJugador > 21) {
            numColumns = 2;
            posicionYInicial = 150;
        }
        if (fichasXJugador > 36) {
            numColumns = 3;
        }

        for (let i = 0; i < fichasXJugador; i++) {
            const columnaActual = i % numColumns;
            const posicionXJugador1 = posicionXJugador1Base - (columnaActual * columnSpacing);
            const posicionXJugador2 = posicionXJugador2Base + (columnaActual * columnSpacing);
            const posicionY = posicionYInicial + (Math.floor(i / numColumns) * espacioVertical);

            this.fichasJugador1.push(new Ficha(posicionXJugador1, posicionY, this.ctx, 30, this.imgJugador1));
            this.fichasJugador2.push(new Ficha(posicionXJugador2, posicionY, this.ctx, 30, this.imgJugador2));
        }
    }

    // Dibuja el tablero, fichas, timer, zona de caida y botones.
    draw() {
        this.clearCanvas();
        this.crearFondo();
        this.timer.drawTimer();
        this.tablero.draw();
        this.tablero.drawZonaCaida();

        this.fichasJugador1.forEach(ficha => ficha.draw(this.jugadorActual, 1));
        this.fichasJugador2.forEach(ficha => ficha.draw(this.jugadorActual, 2));

        this.drawBoton(1130, 30, 22, this.homeMenu);
        this.drawBoton(1180, 30, 22, this.flechaRestart);

    }

    //Coloca el fondo en el canvas
    crearFondo() {
        let pattern = this.ctx.createPattern(this.backgroundImage, "no-repeat");
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //Coloca la imagen para el fondo
    setBackgroundImage(img) {
        this.backgroundImage = img;
    }

    //Coloca la imagen para el botón de reiniciar
    setFlechaRestart(img) {
        this.flechaRestart = img;
    }

    //Coloca la imagen para el botón de menú
    setHomeMenu(img) {
        this.homeMenu = img;
    }

    //Se limpia el canvas colocando la imagen de fondo
    clearCanvas() {
        this.crearFondo();
    }


    //Se selecciona una ficha teniendo en cuenta el turno para colocarle un resaltado y poder moverla en la funcion mvoerFicha. 
    seleccionarFicha(x, y) {
        let fichas = this.jugadorActual === 1 ? this.fichasJugador1 : this.fichasJugador2;
        for (let ficha of fichas) {
            if (ficha.isPointInside(x, y) && !ficha.isColocado()) {
                ficha.setResaltado(true);
                this.fichaSeleccionada = ficha;
                return;
            }
        }
    }

    //Devuelve un booleano si el mouse está sobre una ficha no colocada para colocar el mouse pointer en el mouse move.
    isFichasSeleccionadas(x, y) {
        let fichas = this.jugadorActual === 1 ? this.fichasJugador1 : this.fichasJugador2;
        for (let ficha of fichas) {
            if (ficha.isPointInside(x, y) && !ficha.isColocado()) {
                return true;
            }
        }
    }

    //Mueve la ficha seleccionada en el mouse move.
    moverFicha(x, y) {
        if (this.fichaSeleccionada && !this.fichaSeleccionada.isColocado()) {
            this.fichaSeleccionada.setPosition(x, y);
            this.draw();
        }
    }

   
    soltarFicha(x, y) {
        let columna;
        let fila;
        let ultimoJugador;

        if (this.fichaSeleccionada) {
            const zonaDeCaidaTop = this.tablero.getTopZC();
            const zonaDeCaidaBottom = this.tablero.getBottomZC();
            const zonaDeCaidaLeft = this.tablero.getLeftZC();
            const zonaDeCaidaRight = this.tablero.getRightZC();

            if (y >= zonaDeCaidaTop && y <= zonaDeCaidaBottom && x >= zonaDeCaidaLeft && x <= zonaDeCaidaRight) {
                columna = Math.floor((x - zonaDeCaidaLeft) / this.tablero.tamanoCelda);

                if (columna >= 0 && columna < this.tablero.columnas) {
                    fila = this.tablero.verificarColumna(columna);

                    if (fila !== -1) {
                        const targetX = zonaDeCaidaLeft + columna * this.tablero.tamanoCelda + this.tablero.tamanoCelda / 2;
                        const targetY = this.tablero.startY + fila * this.tablero.tamanoCelda + this.tablero.tamanoCelda / 2;

                        this.startFallingAnimation(targetX, targetY, () => {
                            this.tablero.colocarFicha(fila, columna, this.jugadorActual);
                            this.fichaSeleccionada.setColocado();
                            ultimoJugador = this.jugadorActual;
                            this.cambiarTurno();
                            this.fichasSoltadas++;
                        });
                        if (this.hayGanador(ultimoJugador, columna, fila)) {
                            this.finalizarJuego();
                            setTimeout(() => {
                                this.drawGanador(ultimoJugador);
                            }, 1000);
                        }

                        if (this.fichasSoltadas === this.fichasTotales) {
                            this.finalizarJuego(),
                                setTimeout(() =>
                                    this.drawEmpate()
                                    , 1000);
                        }
                    }
                }
            } else {
                const fichas = this.jugadorActual === 1 ? this.fichasJugador1 : this.fichasJugador2;
                fichas.indexOf(this.fichaSeleccionada);
                this.fichaSeleccionada.setPosicionInicial();
            }
            this.fichaSeleccionada.setResaltado(false);
            this.fichaSeleccionada = null;
            this.draw();
        }

    }


    //Encargada del efecto de gravedad de una ficha al caer. Utiliza requestAnimationFrame. Se va verificando la posición de la ficha en cada frame hasta que caiga en la posición final correspondiente. Actualización de frame según la velocidad. Con onComplete damos por finalizada la animación.
    startFallingAnimation(targetX, targetY, onComplete) {
        const ficha = this.fichaSeleccionada;

        if (ficha) {
            ficha.enCaida = true;
            ficha.targetY = targetY;
            ficha.posX = targetX;
            ficha.velY = 0; 

            const animate = () => {
                ficha.velY += 0.5; 
                ficha.posY += ficha.velY; 

                if (ficha.posY >= ficha.targetY) {
                    ficha.posY = ficha.targetY; 
                    ficha.enCaida = false;
                    ficha.setColocado(); 
                    this.draw();
                } else {
                    this.draw();
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
            onComplete();
        }
    }


    // Return de un boolean para verificar si hay un ganador en cualquiera de las direcciones posibles. 
    hayGanador(jugador, columna, fila) {
        return (
            this.verificarHorizontal(jugador, fila, columna) ||
            this.verificarVertical(jugador, fila, columna) ||
            this.verificarDiagonalPrincipal(jugador, fila, columna) ||
            this.verificarDiagonalSecundaria(jugador, fila, columna)
        );
    }

    //Verificación hacia la izquierda y derecha de la última ficha colocada. Se suma la cantidad de fichas continuas del mismo jugador. Cuando el conteo llega al valor necesario (this.xEnLinea), devuelve true, indicando una victoria horizontal.
    verificarHorizontal(jugador, fila, columna) {
        let conteo = 1;

        // Izquierda
        for (let c = columna - 1; c >= 0 && this.tablero.tablero[fila][c] === jugador; c--) {
            conteo++;
            if (conteo >= this.xEnLinea) return true;
        }

        // Derecha
        for (let c = columna + 1; c < this.tablero.columnas && this.tablero.tablero[fila][c] === jugador; c++) {
            conteo++;
            if (conteo >= this.xEnLinea) return true;
        }

        return false;
    }

    //Verificación hacia abajo  de la última ficha colocada. Se suma la cantidad de fichas continuas del mismo jugador. Cuando el conteo llega al valor necesario (this.xEnLinea), devuelve true, indicando una victoria horizontal.
    verificarVertical(jugador, fila, columna) {
        let conteo = 1;

        // Abajo
        for (let f = fila + 1; f < this.tablero.filas && this.tablero.tablero[f][columna] === jugador; f++) {
            conteo++;
            if (conteo >= this.xEnLinea) return true;
        }

        return false;
    }

    //Verificación hacia arriba-izquierda y abajo-derecha de la última ficha colocada. Se suma la cantidad de fichas continuas del mismo jugador. Cuando el conteo llega al valor necesario (this.xEnLinea), devuelve true, indicando una victoria horizontal.
    verificarDiagonalPrincipal(jugador, fila, columna) {
        let conteo = 1;

        // Arriba-Izquierda
        for (let f = fila - 1, c = columna - 1; f >= 0 && c >= 0 && this.tablero.tablero[f][c] === jugador; f--, c--) {
            conteo++;
            if (conteo >= this.xEnLinea) return true;
        }

        // Abajo-Derecha
        for (let f = fila + 1, c = columna + 1; f < this.tablero.filas && c < this.tablero.columnas && this.tablero.tablero[f][c] === jugador; f++, c++) {
            conteo++;
            if (conteo >= this.xEnLinea) return true;
        }

        return false;
    }

    //Verificación hacia abajo-izquierda y arriba-derecha de la última ficha colocada. Se suma la cantidad de fichas continuas del mismo jugador. Cuando el conteo llega al valor necesario (this.xEnLinea), devuelve true, indicando una victoria horizontal.
    verificarDiagonalSecundaria(jugador, fila, columna) {
        let conteo = 1;

        // Arriba-Derecha
        for (let f = fila - 1, c = columna + 1; f >= 0 && c < this.tablero.columnas && this.tablero.tablero[f][c] === jugador; f--, c++) {
            conteo++;
            if (conteo >= this.xEnLinea) return true;
        }

        // Abajo-Izquierda
        for (let f = fila + 1, c = columna - 1; f < this.tablero.filas && c >= 0 && this.tablero.tablero[f][c] === jugador; f++, c--) {
            conteo++;
            if (conteo >= this.xEnLinea) return true;
        }

        return false;
    }

    //Cuando se da por finalizado el juego se pausa el timer y se imposibilita continuar moviendo las fichas.
    finalizarJuego() {
        this.timer.setPausa(true);
        this.inhabilitarFichas();
    }

    //Cartel de empate cuando el timer llega a 0 o ya no hayan más fichas disponibles. Se opaca el fondo, exceptuando los botones de menu y de reiniciar.
    drawEmpate() {
        // Fondo semi-transparente
        this.ctx.save();
        this.ctx.globalAlpha = 0.85;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    
        // Contenedor del mensaje
        this.ctx.save();
        const boxWidth = 600;
        const boxHeight = 200;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;
    
        // Borde exterior con efecto de brillo
        this.ctx.shadowColor = 'rgba(250, 252, 117, 0.8)';
        this.ctx.shadowBlur = 20;
        this.ctx.strokeStyle = 'rgb(250, 252, 117)';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.restore();
    
        // Título
        this.ctx.font = "bold 48px 'Play', sans-serif";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";
        this.ctx.fillText("¡EMPATE!", 
            this.canvas.width / 2, 
            this.canvas.height / 2 - 20
        );
    
        // Subtítulo
        this.ctx.font = "28px 'Montserrat', sans-serif";
        this.ctx.fillStyle = "rgb(250, 252, 117)";
        this.ctx.fillText("¿Listos para otra batalla?", 
            this.canvas.width / 2, 
            this.canvas.height / 2 + 30
        );
    
        // Botones con efecto de brillo
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(250, 252, 117, 0.5)';
        this.ctx.shadowBlur = 10;
        this.drawBoton(1130, 30, 22, this.homeMenu);
        this.drawBoton(1180, 30, 22, this.flechaRestart);
        this.ctx.restore();
    }


    //Se opaca el fondo, exceptuando los botones de menu y de reiniciar. Dependiendo del ganador se elige su imagen y su texto correspondiente.
    drawGanador(jugador) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = "#000000";  
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        const imagenGanador = new Image();
        if (jugador === 1) {
            imagenGanador.src = "IMG-GAME/ganador-heroes.webp";  
        } else {
            imagenGanador.src = "IMG-GAME/ganador-villanos.jpg";
        }
        imagenGanador.onload = () => {
            const imgWidth = imagenGanador.naturalWidth / 2;
            const imgHeight = imagenGanador.naturalHeight / 2;
            const imgX = (this.canvas.width - imgWidth) / 2;
            const imgY = (this.canvas.height - imgHeight) / 2 - 50;

            this.ctx.drawImage(imagenGanador, imgX, imgY, imgWidth, imgHeight);

            this.ctx.font = "36px 'Montserrat', sans-serif";
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.textAlign = "center";
            if (jugador === 1) {
                this.ctx.fillText(`¡Los Heroes vencieron!`, this.canvas.width / 2, imgY + imgHeight + 50);
            } else {
                this.ctx.fillText(`¡El mal fue el vencedor!`, this.canvas.width / 2, imgY + imgHeight + 50);
            }

            this.drawBoton(1130, 30, 22, this.homeMenu);
            this.drawBoton(1180, 30, 22, this.flechaRestart); 
        };
    }

    //Cambia el turno del jugador.
    cambiarTurno() {
        this.jugadorActual = this.jugadorActual === 1 ? 2 : 1;
    }

    getTablero() {
        return this.tablero;
    }

    //Inhabilita las fichas de ambos jugadores haciendo que todas tengan el atributo de colocado.
    inhabilitarFichas() {
        [...this.fichasJugador1, ...this.fichasJugador2].forEach(ficha => ficha.setColocado());
    }

    //Al clickear el botón de reset, se reinician los parámetros necesarios y se inicializan las fichas nuevamente.
    reiniciarJuego(x, y) {
        if (this.isPointerOnResetButton(x, y)) {
            this.clearCanvas();
            this.tablero.clearTablero();
            this.fichasJugador1 = [];
            this.fichasJugador2 = [];
            this.timer.resetTimer();
            this.timer.pausa = false;
            this.timer.empate = false;
            this.jugadorActual = 1;
            this.fichaSeleccionada = null;
            this.isMouseDown = false;
            this.fichasSoltadas = 0;
            this.inicializarFichas();
            this.draw();
        }
    }

    //Al clickear el botón de menú, se para el timer, se deshabilita el juego y se carga la pantalla de menú.
    volverAlMenu(x, y) {
        if (this.isPointerOnMenuButton(x, y)) {
            this.timer.borrarIntervalo();
            this.isHabilitado = false;
            this.fichasSoltadas = 0;
            loadMain();
        }
    }

    // Dibuja el boton de reinciar y el boton de menú con sus imágenes correspondientes en la esquina superior derecha.
    drawBoton(x, y, radius, img) {
        let color = "rgb(255, 255, 255)"
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.drawImage(img, x - 17, y - 18, 35, 35);
        this.ctx.closePath();

    }

    //Se verifica si el mouse se encuentra dentro de las coordenadas del botón para reiniciar.
    isPointerOnResetButton(x, y) {
        let posX = 1180;
        let posY = 30;
        let radius = 20;
        let _x = posX - x;
        let _y = posY - y;
        let resultado = Math.sqrt(_x * _x + _y * _y) < radius;
        return resultado;
    }

     //Se verifica si el mouse se encuentra dentro de las coordenadas del botón para reiniciar.
    isPointerOnMenuButton(x, y) {
        let posX = 1130;
        let posY = 30;
        let radius = 20;
        let _x = posX - x;
        let _y = posY - y;
        let resultado = Math.sqrt(_x * _x + _y * _y) < radius;
        return resultado;

    }

    //Devuelve el valor del atributo habilitado para saber si es jugable.
    isHabilitado() {
        return this.habilitado;
    }

    setHabilitado(habilitado) {
        this.habilitado = habilitado;
    }

}