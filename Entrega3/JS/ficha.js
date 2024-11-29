class Ficha {
     // Constructor: Inicializa una ficha con su posición, contexto, radio e imagen del jugador
    constructor(posX, posY, ctx, radius, imgJugador) {
        this.posIniX = posX;
        this.posIniY = posY;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.radius = radius;
        this.fill = imgJugador;
        this.resaltado = false;
        this.colocado = false;
        this.velY = 0;
        this.enCaida = false;
    }
    // Dibuja la ficha en el canvas con su imagen correspondiente
    // Si no es el turno del jugador, la ficha se muestra semi transparente
    // Si está resaltada, se dibuja un borde amarillo
    draw(turnoActual, jugadorFicha) {
        this.ctx.save();
        
        if (turnoActual !== jugadorFicha && this.colocado === false) {
            this.ctx.globalAlpha = 0.3; 
        } else {
            this.ctx.globalAlpha = 1; 
        }

        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = "transparent"; 
        this.ctx.closePath();
        this.ctx.drawImage(this.fill, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);
        this.ctx.restore();

        if (this.resaltado === true) {
            this.ctx.strokeStyle = "yellow";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

   // Verifica si un punto (x,y) está dentro del área de la ficha
    // Utiliza el teorema de Pitágoras para calcular la distancia al centro
    isPointInside(x, y) {
        let _x = this.posX - x;
        let _y = this.posY - y;
        let resultado = Math.sqrt(_x * _x + _y * _y) < this.radius;
        
        return resultado;
    }

    getPosition() {
        return { x: this.posX, y: this.posY };
    }

    getPosY() {
        return this.posY;
    }

    getPosX() {
        return this.posX;
    }

    getFill() {
        return this.fill;
    }

    getFill() {
        return this.resaltado;
    }

    isColocado(){
        return this.colocado;
    }

    setFill(fill) {
        this.fill = fill;
    }

    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }

    // Cambia el estado de resaltado de la ficha (para mostrar selección)
    setResaltado(bool) {
        this.resaltado = bool;
    }

    // Devuelve la ficha a su posición inicial
    setPosicionInicial() {
        this.setPosition(this.posIniX,this.posIniY);
    } 

     // Marca la ficha como colocada en el tablero (no se puede mover más)
    setColocado(){
        this.colocado = true;
    }

}