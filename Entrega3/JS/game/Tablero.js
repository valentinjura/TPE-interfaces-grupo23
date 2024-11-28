class Tablero {
    constructor(ctx, xEnLinea, tamanoCelda) {
        this.ctx = ctx;
        this.xEnLinea = xEnLinea;
        this.filas = 6;
        this.columnas = 7;
        this.tamanoCelda = tamanoCelda;
        this.imgTablero;
        this.startX = 0;
        this.startY = 0;
        this.tablero = this.crearTablero();
        this.imgArrow;
        this.imgArrowHover;
    }

    //Crea la matriz del tablero al ser llamada desde el contructor. Tiene en cuenta la cantidad de enLinea para elegir las dimensiones del tablero.
    crearTablero() {
        if (this.xEnLinea==5) {
            this.columnas = 8;
            this.filas = 7;
        } else if (this.xEnLinea==6) {
            this.columnas = 9;
            this.filas = 8;
        } else if (this.xEnLinea==7) {
            this.columnas = 10;
            this.filas = 9;
        }
        return Array.from({ length: this.filas }, () => Array(this.columnas).fill(0));
    }

    //Cambia la imagen para el tablero
    setImgTablero(img){
        this.imgTablero = img;
    }

    //Dibuja el tablero. 
    // 1. Calcula la posición para centrar el tablero.
    // 2. Dibuja las celdas del tablero con un doble for
    draw() {
        const canvasWidth = 1205;
        const canvasHeight = 750;
    
        // Calculate the board's total width and height
        const boardWidth = this.columnas * this.tamanoCelda;
        const boardHeight = this.filas * this.tamanoCelda;
    
       
        this.startX = (canvasWidth - boardWidth) / 2;
        this.startY = (canvasHeight - boardHeight) / 2;
    
      
        this.ctx.drawImage(
            this.imgTablero, 
            this.startX - 10, 
            this.startY - 10, 
            boardWidth + 20,   
            boardHeight + 20
        );
    
        for (let fila = 0; fila < this.filas; fila++) {
            for (let columna = 0; columna < this.columnas; columna++) {
                let x = this.startX + columna * this.tamanoCelda + this.tamanoCelda / 2;
                let y = this.startY + fila * this.tamanoCelda + this.tamanoCelda / 2;
    
                this.ctx.beginPath();
                this.ctx.arc(x, y, this.tamanoCelda / 2.2, 0, Math.PI * 2);
                this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }
    }
    //Se dibuja la zona de caida sobre el tablero y se coloca una imagen para
    //indicar las columnas donde caería la ficha. Si el jugador tiene una
    //ficha agarrada y pasa sobre la zona de caida,la imagen se resalta.
    drawZonaCaida(mousePosX, mousePosY) {
        const zonaDeCaidaTop = this.getTopZC();
        const zonaDeCaidaLeft = this.getLeftZC();

        for (let col = 0; col < this.columnas; col++) {
            const x = zonaDeCaidaLeft + col * this.tamanoCelda;
            const y = zonaDeCaidaTop;

            if (this.isHoveredOverCell(mousePosX, mousePosY, col)) {
                this.ctx.drawImage(this.imgArrowHover, x + this.tamanoCelda/4, y + this.tamanoCelda/4, this.tamanoCelda/2, this.tamanoCelda/2);
            } else {
                this.ctx.drawImage(this.imgArrow, x + this.tamanoCelda/4, y + this.tamanoCelda/4, this.tamanoCelda/2, this.tamanoCelda/2);
            }
        }
    }

    //Utilizada para saber si el mouse está pasando sobre la zona correspodiente a la caída. 
    //Devuelve un booleano.
    isHoveredOverCell(mouseX, mouseY, columna) {
        const zonaDeCaidaTop = this.getStartY() - 80;
        const zonaDeCaidaLeft = this.getStartX();
        
        const x = zonaDeCaidaLeft + columna * this.tamanoCelda;
        const y = zonaDeCaidaTop;

        return mouseX >= x && mouseX <= x + this.tamanoCelda &&
                mouseY >= y && mouseY <= y + this.tamanoCelda;
    }

    // Funciones para obtener las dimensiones de la zona de caida
    getTopZC(){
        return this.getStartY() - this.tamanoCelda;
    }
    getBottomZC(){
        return this.getStartY();
    }
    getLeftZC(){
        return this.getStartX();
    }
    getRightZC(){
        return this.getStartX() + this.columnas * this.tamanoCelda;
    }

    // Función para colocar una ficha en la columna correcta
    colocarFicha(fila, columna, jugador) {
        this.tablero[fila][columna] = jugador;
    }

    // Verifica si hay un espacio disponible en la columna
    verificarColumna(columna) {
        for (let fila = this.filas - 1; fila >= 0; fila--) {
            if (this.tablero[fila][columna] === 0) {
                return fila;
            }   
        }
        return -1;
    }

    //Devuelve las filas
    getFilas() {
        return this.filas;
    }

    //Devuelve las columnas
    getColumnas() {
        return this.columnas;
    }

    //Devuelve el tamaño de la celda
    getTamanoCelda(){
        return this.tamanoCelda;
    }

    getTablero(){
        return this.tablero;
    }

    getStartX(){
        return this.startX;
    }

    getStartY(){
        return this.startY;
    }

    clearTablero() {
        this.tablero = this.crearTablero();
    }

    //Coloca la imagen para la flecha normal
    setImgNormal(imagen){
        this.imgArrow = imagen;
    }

    //Coloca la imagen para la flecha resaltada
    setImgResaltada(imagen){
        this.imgArrowHover = imagen;
    }

}