"use strict";
import { Ficha } from './Ficha.js';
import { Casillero } from './Casillero.js';

export class Tablero {
  casilleros = [];
  canvasJuego;
  tableroImg;
  rows;
  columns;
  casilleroImagen;
  animacionId;

  constructor(line) {
    if (line <= 0) {
      throw new Error("line debe ser un número entero positivo el numero es: ");
    }
    this.line = line;
    this.rows = line + 2;
    this.columns = line + 3;
    this.anchoColumna = 55;
    this.canvasJuego = document.getElementById("canvaJuego");
    let offsetY = 0;
    let direccion = 1;
    const velocidad = 0.5;
    const maxDesplazamiento = 5;

    // Crear un gradiente como fondo en lugar de una imagen
    this.createBackground();
    
    this.initTablero();
  }

  createBackground() {
    // Crear un canvas temporal para generar el patrón de fondo
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 200;  // Tamaño del patrón
    tempCanvas.height = 200;

    // Crear un gradiente oscuro que simule una ciudad nocturna
    const gradient = tempCtx.createLinearGradient(0, 0, 0, tempCanvas.height);
    gradient.addColorStop(0, '#1a1a2e');     // Azul muy oscuro
    gradient.addColorStop(0.5, '#16213e');   // Azul medio oscuro
    gradient.addColorStop(1, '#0f3460');     // Azul oscuro

    // Aplicar el gradiente
    tempCtx.fillStyle = gradient;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Añadir algunos detalles que simulen luces de ciudad
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * tempCanvas.width;
      const y = Math.random() * tempCanvas.height;
      const size = Math.random() * 2 + 1;
      
      tempCtx.beginPath();
      tempCtx.arc(x, y, size, 0, Math.PI * 2);
      tempCtx.fillStyle = `rgba(255, 255, 200, ${Math.random() * 0.3})`;
      tempCtx.fill();
    }

    // Guardar el patrón
    this.backgroundPattern = tempCtx.createPattern(tempCanvas, 'repeat');
  }

  dibujarTablero(ctx) {
    const anchoCasillero = this.anchoColumna;
    const offsetX = Math.floor((this.canvasJuego.width - this.columns * anchoCasillero) / 2);
    const offsetY = Math.floor((this.canvasJuego.height - this.rows * anchoCasillero) / 2);
    const anchoTablero = this.columns * anchoCasillero + 14;
    const altoTablero = this.rows * anchoCasillero + 14;
    
    // Dibujar el fondo usando el patrón generado
    ctx.fillStyle = this.backgroundPattern;
    ctx.fillRect(offsetX - 10, offsetY - 10, anchoTablero, altoTablero);

    // Añadir un borde suave al tablero
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX - 10, offsetY - 10, anchoTablero, altoTablero);
    
    // Dibujar casilleros
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const x = offsetX + j * anchoCasillero;
        const y = offsetY + i * anchoCasillero;
            
        // Dibujar hueco redondo con efecto de profundidad
        // Sombra exterior
        ctx.beginPath();
        ctx.arc(
          x + anchoCasillero / 2, 
          y + anchoCasillero / 2, 
          anchoCasillero * 0.4,
          0, 
          Math.PI * 2
        );
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
            
        // Fondo de cada casillero
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Resetear sombra
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
            
        // Borde de cada casillero
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        ctx.stroke();
            
        // Si hay una ficha, dibujarla
        const casillero = this.casilleros[i][j];
        if (!casillero.estaVacio()) {
          const ficha = casillero.getFicha();
          this.dibujarFicha(ctx, x, y, ficha);
        }
      }
    }
    
    // Dibujar las flechas animadas
    this.dibujarFlechas(ctx);
  }

  dibujarFicha(ctx, x, y, ficha) {
    const radio = this.anchoColumna * 0.4;
    const centroPosX = x + this.anchoColumna / 2;
    const centroPosY = y + this.anchoColumna / 2;
    
    // Efecto de sombra para las fichas
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.beginPath();
    ctx.arc(centroPosX, centroPosY, radio, 0, Math.PI * 2);
    
    // Gradiente para dar efecto 3D a las fichas
    const gradient = ctx.createRadialGradient(
      centroPosX - radio/3, 
      centroPosY - radio/3, 
      radio/10,
      centroPosX,
      centroPosY,
      radio
    );
    gradient.addColorStop(0, '#a0a0a0');
    gradient.addColorStop(1, '#707070');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = '#505050';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  dibujarFlechas(ctx) {
    const anchoCasillero = this.anchoColumna;
    const altoFlecha = 21;
    const anchoFlecha = 28;

    const zonaX = (this.canvasJuego.width - this.columns * anchoCasillero) / 2;
    const basePosY = ((this.canvasJuego.height - this.rows * anchoCasillero) / 2 - altoFlecha) - 7;

    const time = Date.now() * 0.003; 
    const offset = Math.sin(time) * 4; 

    for (let columna = 0; columna < this.columns; columna++) {
      const posX = zonaX + columna * anchoCasillero + anchoCasillero / 2;
      const posY = basePosY + offset; 

      // Añadir efecto de brillo a las flechas
      const gradient = ctx.createLinearGradient(
        posX - anchoFlecha / 2,
        posY,
        posX + anchoFlecha / 2,
        posY + altoFlecha
      );
      gradient.addColorStop(0, 'rgba(0, 180, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 128, 0, 0.6)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(posX - anchoFlecha / 2, posY);
      ctx.lineTo(posX + anchoFlecha / 2, posY);
      ctx.lineTo(posX, posY + altoFlecha);
      ctx.closePath();
      ctx.fill();

      // Añadir brillo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  
  colocarFichaEnColumna(columna, ficha) {
    const fila = this.ultimaFilaDisponible(columna);
    if (fila !== -1) {
      this.casilleros[fila][columna].colocarFicha(ficha);

      const casillero = this.casilleros[fila][columna];
      const posYInicial = 0;
      const posYFinal = casillero.getPosY() + casillero.ancho / 2;

      let posYActual = posYInicial;

      if (this.animacionId) {
        cancelAnimationFrame(this.animacionId);
      }

      const animacion = () => {
        posYActual += (posYFinal - posYActual) * 0.13;
        ficha.setPosicion(
          casillero.getPosX() + casillero.ancho / 2,
          posYActual
        );

        if (Math.abs(posYFinal - posYActual) < 1) {
          ficha.setPosicion(
            casillero.getPosX() + casillero.ancho / 2,
            posYFinal
          );
          return;
        }

        this.animacionId = requestAnimationFrame(animacion);
      };
      this.animacionId = requestAnimationFrame(animacion);
      return true;
    } else {
      console.log("La columna está llena");
      return false;
    }
  }

  columnaDisponible(columna) {
    return this.ultimaFilaDisponible(columna) !== -1;
  }

  ultimaFilaDisponible(columna) {
    if (columna < 0 || columna >= this.columns) {
      console.log("Posición fuera de los límites del tablero");
      return -1;
    }

    for (let i = this.rows - 1; i >= 0; i--) {
      if (
        this.casilleros[i] &&
        this.casilleros[i][columna] &&
        this.casilleros[i][columna].estaVacio()
      ) {
        return i;
      }
    }

    console.log(`Columna llena`);
    return -1;
  }

  //CHECKEOS
  //-----------VERIFICAR GANADOR-----------
  verifyWinner(fichaGanadora) {
    const anchoCasillero = this.anchoColumna;
    const zonaX = (this.canvasJuego.width - this.columns * anchoCasillero) / 2;
    const columna = Math.floor(
      (fichaGanadora.getPosX() - zonaX) / anchoCasillero
    );
    console.log("la columna eeees: " + columna);
    const fila = this.ultimaFilaDisponible(columna) + 1;
    console.log("la filaa eeeeess:" + fila);

    let casilleroActual = this.casilleros[fila][columna];

    return (
      this.verifyHorizontal(casilleroActual) ||
      this.verifyVertical(casilleroActual) ||
      this.verifyDiagonalDescendente(casilleroActual) ||
      this.verifyDiagonalAscendente(casilleroActual)
    );
  }

  //HORIZONTAL
  verifyHorizontal(casilleroActual) {
    if (!casilleroActual.estaVacio()) {
      return (
        this.checkHorizontal(casilleroActual, 1) ||
        this.checkHorizontal(casilleroActual, -1)
      );
    }
    return false;
  }

  verifyVertical(casilleroActual) {
    if (!casilleroActual.estaVacio()) {
      return (
        this.checkVertical(casilleroActual, 1) ||
        this.checkVertical(casilleroActual, -1)
      );
    }
    return false;
  }

  verifyDiagonalDescendente(casilleroActual) {
    if (!casilleroActual.estaVacio()) {
      return (
        this.checkDiagonalDescendente(casilleroActual, 1) ||
        this.checkDiagonalDescendente(casilleroActual, -1)
      );
    }
    return false;
  }

  verifyDiagonalAscendente(casilleroActual) {
    if (!casilleroActual.estaVacio()) {
      return (
        this.checkDiagonalAcsendente(casilleroActual, 1) ||
        this.checkDiagonalAcsendente(casilleroActual, -1)
      );
    }
    return false;
  }

  checkHorizontal(casilleroActual) {
    //console.log("entro");
    let cont = 1;

    if (casilleroActual.getFicha() === null) {
      return false;
    }

    const equipo = casilleroActual.getFicha().getEquipo();

    for (let i = casilleroActual.getColumn() + 1; i < this.columns; i++) {
      const fichaDerecha =
        this.casilleros[casilleroActual.getRow()][i].getFicha();

      if (fichaDerecha && fichaDerecha.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    for (let j = casilleroActual.getColumn() - 1; j >= 0; j--) {
      const fichaIzquierda =
        this.casilleros[casilleroActual.getRow()][j].getFicha();
      if (fichaIzquierda && fichaIzquierda.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }
    return cont === this.line;
  }

  checkVertical(casilleroActual) {
    let cont = 1;

    if (casilleroActual.getFicha() === null) {
      return false;
    }
    const equipo = casilleroActual.getFicha().getEquipo();

    for (let i = casilleroActual.getRow() + 1; i < this.rows; i++) {
      const fichaAbajo =
        this.casilleros[i][casilleroActual.getColumn()].getFicha();

      if (fichaAbajo && fichaAbajo.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    for (let j = casilleroActual.getRow() - 1; j >= 0; j--) {
      const fichaArriba =
        this.casilleros[j][casilleroActual.getColumn()].getFicha();
      if (fichaArriba && fichaArriba.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }
    return cont === this.line;
  }

  checkDiagonalDescendente(casilleroActual) {
    let cont = 1;

    if (casilleroActual.getFicha() === null) {
      return false;
    }
    const equipo = casilleroActual.getFicha().getEquipo();

    for (
      let i = casilleroActual.getRow() + 1, j = casilleroActual.getColumn() + 1;
      i < this.rows && j < this.columns;
      i++, j++
    ) {
      const fichaAbajoDerecha = this.casilleros[i][j].getFicha();

      if (fichaAbajoDerecha && fichaAbajoDerecha.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    for (
      let i = casilleroActual.getRow() + 1, j = casilleroActual.getColumn() - 1;
      i < this.rows && j >= 0;
      i++, j--
    ) {
      const fichaAbajoIzquierda = this.casilleros[i][j].getFicha();
      if (fichaAbajoIzquierda && fichaAbajoIzquierda.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }
    return cont === this.line;
  }

  checkDiagonalAcsendente(casilleroActual) {
    let cont = 1;

    if (casilleroActual.getFicha() === null) {
      return false;
    }

    const equipo = casilleroActual.getFicha().getEquipo();

    for (
      let i = casilleroActual.getRow() - 1, j = casilleroActual.getColumn() + 1;
      i >= 0 && j < this.columns;
      i--, j++
    ) {
      const fichaArribaDerecha = this.casilleros[i][j].getFicha();

      if (fichaArribaDerecha && fichaArribaDerecha.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    for (
      let i = casilleroActual.getRow() - 1, j = casilleroActual.getColumn() - 1;
      i >= 0 && j >= 0;
      i--, j--
    ) {
      const fichaArribaIzquierda = this.casilleros[i][j].getFicha();

      if (fichaArribaIzquierda && fichaArribaIzquierda.getEquipo() === equipo) {
        cont++;
      } else {
        break;
      }
    }

    return cont === this.line;
  }
}

//export default Tablero;
