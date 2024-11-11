let game;  // Variable global para el juego
let selectedCharacters = {
    player1: 'batman',
    player2: 'joker'
};
let lineLength = 4; // Default line length

class ConnectXGame {
    constructor(canvasId, options = {}) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.backgroundImage = new Image();
      this.backgroundImage.src = 'gotham-city.png';
  
      this.lineLength = options.lineLength || 4;
      this.dimensions = this.calculateBoardDimensions(this.lineLength);
      this.canvas.width = this.dimensions.cols * this.dimensions.cellSize;
      this.canvas.height = this.dimensions.rows * this.dimensions.cellSize;
  
      this.characters = {
        batman: {
          image: 'batman.png',
          name: 'Batman',
        },
        joker: {
          image: 'joker.png',
          name: 'Joker',
        },
      };
      
      this.backgroundImage.onerror = () => {
        this.backgroundImage.src = 'https://via.placeholder.com/800x600';
      };
      this.images.player1.onerror = () => {
        this.images.player1.src = 'Batman';
      };
      this.images.player2.onerror = () => {
        this.images.player2.src = 'Joker';
      };
      this.config = {
        cellSize: this.dimensions.cellSize,
        cols: this.dimensions.cols,
        rows: this.dimensions.rows,
        lineLength: options.lineLength || 4,
        turnDuration: options.turnDuration || 60,
        theme: {
          board: '#3a3f47',
          empty: '#FFFFFF',
          gridLines: '#2a2f37',
        },
        animationSpeed: 15,
        gravity: 0.5,
        holeSize: 0.4,
        pieceSize: 0.4,
      };
  
      this.selectedCharacters = {
        player1: options.player1Character || 'batman',
        player2: options.player2Character || 'joker',
      };
  
      this.images = {
        player1: new Image(),
        player2: new Image(),
      };
      this.images.player1.src = this.characters[this.selectedCharacters.player1].image;
      this.images.player2.src = this.characters[this.selectedCharacters.player2].image;
  
      this.state = {
        board: null,
        currentTurn: 'player1',
        isGameOver: false,
        timer: this.config.turnDuration,
        intervalId: null,
        hoverColumn: null,
        pieces: [],
      };
  
      this.handleClick = this.handleClick.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.draw = this.draw.bind(this);
  
      this.init();
    }
    

    calculateBoardDimensions(lineLength) {
        // Calcular dimensiones basadas en lineLength
        const rows = lineLength + 2;
        const cols = lineLength + 3;
        
        // Calcular el tamaño de celda basado en el tamaño de la ventana
        const maxWidth = window.innerWidth * 0.8;
        const maxHeight = window.innerHeight * 0.8;
        
        // Calcular el tamaño de celda inicial
        let cellSize = Math.min(
            Math.floor(maxWidth / cols),
            Math.floor(maxHeight / rows),
            55 // Tamaño máximo de celda
        );
        
        // Asegurar un tamaño mínimo de celda
        cellSize = Math.max(cellSize, 35);
        
        return {
            rows,
            cols,
            cellSize
        };
    }
    
    switchTurn() {
        // Primero limpiamos cualquier estado de hover previo
        this.state.hoverColumn = null;
        
        // Cambiamos el turno
        this.state.currentTurn = this.state.currentTurn === 'player1' ? 'player2' : 'player1';
        
        // Actualizamos el timer y el indicador visual
        this.resetTimer();
        this.updateTurnIndicator();
        
        // Forzamos un repintado inmediato
        this.draw();
    }
    initDraggablePieces() {
        const piece1 = document.getElementById('piece-player1');
        const piece2 = document.getElementById('piece-player2');
    
        [piece1, piece2].forEach(piece => {
            piece.draggable = true;
            piece.addEventListener('dragstart', (e) => this.onDragStart(e, piece));
        });
    
        this.canvas.addEventListener('dragover', (e) => e.preventDefault());
        this.canvas.addEventListener('drop', (e) => this.onDrop(e));
    }
    
    onDragStart(event, piece) {
        event.dataTransfer.setData('player', piece.id.includes('player1') ? 'player1' : 'player2');
    }
    
    onDrop(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const col = Math.floor(x / this.config.cellSize);
    
        const player = event.dataTransfer.getData('player');
        if (this.isValidMove(col)) {
            this.startDroppingPiece(col, player);
        }
    }

    init() {
        this.initBoard();
        this.setupEventListeners();
        this.resetTimer();
        this.draw();
        this.updateTurnIndicator();
    }

    initBoard() {
        this.state.board = Array(this.config.rows).fill(null)
            .map(() => Array(this.config.cols).fill(null));
        this.canvas.width = this.config.cols * this.config.cellSize;
        this.canvas.height = this.config.rows * this.config.cellSize;
        this.state.pieces = [];
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBoard();
        this.drawPieces();
        
        if (!this.state.isGameOver && !this.state.pieces.some(p => p.isAnimating)) {
            this.drawHoverPreview();
        }

        requestAnimationFrame(this.draw);
    }

    
    drawEmptyCell(row, col) {
        const x = (col * this.config.cellSize) + (this.config.cellSize / 2);
        const y = (row * this.config.cellSize) + (this.config.cellSize / 2);
        const radius = this.config.cellSize * this.config.holeSize;

        this.ctx.fillStyle = this.config.theme.empty;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawPieces() {
        this.state.pieces.forEach(piece => {
            if (piece.isAnimating) {
                piece.velocity += this.config.gravity;
                piece.y += piece.velocity;

                const targetY = (piece.targetRow * this.config.cellSize) + (this.config.cellSize / 2);

                if (piece.y >= targetY) {
                    piece.y = targetY;
                    piece.isAnimating = false;

                    let bounceHeight = 10;
                    let bounceDuration = 200;
                    let startY = piece.y;
                    let startTime = null;

                    const bounce = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / bounceDuration, 1);
                        const bouncePosition = startY - bounceHeight * Math.sin(progress * Math.PI);

                        piece.y = bouncePosition;

                        if (progress < 1) {
                            requestAnimationFrame(bounce);
                        } else {
                            piece.y = targetY;
                            this.state.board[piece.targetRow][piece.col] = piece.player;

                            if (this.checkWinner(piece.targetRow, piece.col)) {
                                this.handleWin();
                            } else {
                                this.switchTurn();
                            }
                        }
                    };

                    requestAnimationFrame(bounce);
                }
            }
            this.drawPiece(piece.x, piece.y, piece.player);
        });
    }

    bounceEffect(piece) {
        let bounceHeight = 10;
        let bounceDuration = 500;
        let startTime = null;
        
        const animateBounce = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / bounceDuration, 1);
            const bounceOffset = Math.sin(progress * Math.PI) * bounceHeight;

            piece.y -= bounceOffset;

            if (progress < 1) {
                requestAnimationFrame(animateBounce);
            } else {
                piece.y += bounceOffset;
            }
        };

        requestAnimationFrame(animateBounce);
    }

    drawPiece(x, y, player) {
        const cellSize = this.config.cellSize;
        const image = this.images[player];
        
        if (image.complete) {
            // Usar un tamaño ligeramente menor que el tamaño de la celda para evitar pixelación
            const pieceSize = Math.floor(cellSize * 0.85);
            
            // Centrar la pieza con precisión matemática
            const offsetX = Math.floor(pieceSize / 2);
            const offsetY = Math.floor(pieceSize / 2);
    
            // Aplicar suavizado
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
    
            // Guardar el contexto actual
            this.ctx.save();
            
            // Aplicar transformaciones para mejorar la calidad
            this.ctx.translate(Math.floor(x), Math.floor(y));
            
            // Dibujar la imagen con coordenadas precisas
            this.ctx.drawImage(
                image,
                -offsetX,
                -offsetY,
                pieceSize,
                pieceSize
            );
            
            // Restaurar el contexto
            this.ctx.restore();
        } else {
            // Draw a text-based representation of the character
            this.ctx.font = `${this.config.cellSize * 0.6}px Arial`;
            this.ctx.fillText(this.characters[player].name, x - (this.config.cellSize * 0.3), y + (this.config.cellSize * 0.4));
          }
    }
    
    startDroppingPiece(col) {
        const row = this.getLowestEmptyRow(col);
        if (row === -1) return;

        const piece = {
            player: this.state.currentTurn,
            col: col,
            targetRow: row,
            x: (col * this.config.cellSize) + (this.config.cellSize / 2),
            y: -this.config.cellSize,
            velocity: 0,
            isAnimating: true
        };

        this.state.pieces.push(piece);
        this.state.hoverColumn = null;
    }


  
    handleClick(e) {
        if (this.state.isGameOver || this.state.pieces.some(p => p.isAnimating)) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const col = Math.floor(x / this.config.cellSize);

        if (this.isValidMove(col)) {
            this.startDroppingPiece(col);
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const col = Math.floor(x / this.config.cellSize);

        if (col >= 0 && col < this.config.cols) {
            this.state.hoverColumn = col;
        }
    }

    isValidMove(col) {
        return col >= 0 && col < this.config.cols && this.getLowestEmptyRow(col) !== -1;
    }

    getLowestEmptyRow(col) {
        for (let row = this.config.rows - 1; row >= 0; row--) {
            if (!this.state.board[row][col]) return row;
        }
        return -1;
    }

    checkWinner(row, col) {
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal /
            [[1, -1], [-1, 1]]  // Diagonal \
        ];

        return directions.some(direction => {
            let count = 1;
            direction.forEach(([dx, dy]) => {
                let r = row + dy;
                let c = col + dx;
                while (
                    r >= 0 && r < this.config.rows &&
                    c >= 0 && c < this.config.cols &&
                    this.state.board[r][c] === this.state.currentTurn
                ) {
                    count++;
                    r += dy;
                    c += dx;
                }
            });
            return count >= this.config.lineLength;
        });
    }

    switchTurn() {
        this.state.currentTurn = this.state.currentTurn === 'player1' ? 'player2' : 'player1';
        this.resetTimer();
        this.updateTurnIndicator();
    }

    handleWin() {
        this.state.isGameOver = true;
        clearInterval(this.state.intervalId);
        const winnerName = this.characters[this.selectedCharacters[this.state.currentTurn]].name;
        this.showMessage(`¡${winnerName} ha ganado!`);
    }
    resetTimer() {
        clearInterval(this.state.intervalId);
        this.state.timer = this.config.turnDuration;
        this.updateTimerDisplay();

        this.state.intervalId = setInterval(() => {
            this.state.timer--;
            this.updateTimerDisplay();

            if (this.state.timer <= 0) {
                this.switchTurn();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('time-left');
        if (timerElement) {
            timerElement.textContent = this.state.timer;
        }
    }

    updateTurnIndicator() {
        const turnIndicator = document.getElementById('turn-indicator');
        if (turnIndicator) {
            turnIndicator.textContent = `Turno: ${this.state.currentTurn === 'player1' ? 'Jugador 1' : 'Jugador 2'}`;
        }
    }
    drawBoard() {
        // Primero dibujamos el fondo con un efecto de gradiente oscuro
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Si hay una imagen de fondo, la dibujamos con opacidad reducida
        if (this.backgroundImage.complete) {
            this.ctx.globalAlpha = 0.15; // Reduce la opacidad del fondo
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 1.0;
        }
    
        // Agregar efecto de neblina/humo
        this.drawSmoke();
        
        // Dibujar el grid del juego
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                this.drawEmptyCell(row, col);
            }
        }
    }
    
    // Agregar método para el efecto de humo
    drawSmoke() {
        const time = Date.now() * 0.001;
        const smokeParticles = 5;
        
        for (let i = 0; i < smokeParticles; i++) {
            const x = Math.sin(time + i * 2.0) * (this.canvas.width / 4) + this.canvas.width / 2;
            const y = Math.cos(time + i * 1.5) * (this.canvas.height / 4) + this.canvas.height / 2;
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 100);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.01)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 100, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // Actualizar el método drawEmptyCell para mejorar el aspecto visual
    drawEmptyCell(row, col) {
        const x = (col * this.config.cellSize) + (this.config.cellSize / 2);
        const y = (row * this.config.cellSize) + (this.config.cellSize / 2);
        const radius = this.config.cellSize * this.config.holeSize;
    
        // Crear un efecto de brillo
        const gradient = this.ctx.createRadialGradient(x, y, radius * 0.8, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    
        // Dibujar el agujero con efecto de profundidad
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fill();
    
        // Agregar el brillo
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.95, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(46, 139, 87, 0.9);  // Verde oscuro
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            z-index: 1000;
            animation: messagePopup 0.5s ease-out;
            border: 2px solid #2E8B57;  // Borde verde
            box-shadow: 0 0 20px rgba(46, 139, 87, 0.5);  // Sombra verde
        `;
    
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes messagePopup {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                80% {
                    transform: translate(-50%, -50%) scale(1.1);
                    opacity: 0.9;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
    
        
        // Agregar efecto de confeti
        this.createConfetti();
        
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.5s ease-in forwards';
            setTimeout(() => {
                messageDiv.remove();
                style.remove();
            }, 500);
        }, 3000);
    }
    
    createVictoryEffect() {
        const winner = this.state.currentTurn;
        const isHero = winner === 'player1'; // Asumiendo que player1 es siempre el héroe
        
        // Crear elementos de efecto según el ganador
        const effectCount = 50;
        const effectElements = [];
        
        for (let i = 0; i < effectCount; i++) {
            const effect = document.createElement('div');
            
            if (isHero) {
                // Efecto de murciélagos para Batman
                effect.style.cssText = `
                    position: fixed;
                    width: 20px;
                    height: 20px;
                    background: rgba(0, 0, 0, 0.8);
                    clip-path: path('M10 0 L20 8 L15 20 L10 15 L5 20 L0 8 Z');
                    top: -20px;
                    left: ${Math.random() * 100}vw;
                    animation: batFlight ${Math.random() * 3 + 2}s ease-in-out forwards;
                    z-index: 999;
                `;
            } else {
                // Efecto de risas "HA HA" para el Joker
                effect.textContent = 'HA';
                effect.style.cssText = `
                    position: fixed;
                    color: #1dcd16;
                    font-family: 'Comic Sans MS', cursive;
                    font-size: ${Math.random() * 20 + 20}px;
                    font-weight: bold;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    top: -30px;
                    left: ${Math.random() * 100}vw;
                    animation: jokerLaugh ${Math.random() * 3 + 2}s ease-in-out forwards;
                    z-index: 999;
                    transform: rotate(${Math.random() * 360}deg);
                `;
            }
            
            effectElements.push(effect);
            document.body.appendChild(effect);
        }
        
        // Agregar estilos de animación
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes batFlight {
                0% {
                    transform: translateY(0) rotate(0deg) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                50% {
                    transform: translateY(50vh) rotate(${Math.random() > 0.5 ? 360 : -360}deg) scale(1.5);
                }
                100% {
                    transform: translateY(100vh) rotate(${Math.random() > 0.5 ? 720 : -720}deg) scale(0.5);
                    opacity: 0;
                }
            }
            
            @keyframes jokerLaugh {
                0% {
                    transform: translateY(0) rotate(0deg) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                50% {
                    transform: translateY(50vh) rotate(${Math.random() * 720 - 360}deg) scale(2);
                }
                100% {
                    transform: translateY(100vh) rotate(${Math.random() * 1440 - 720}deg) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
        
        // Limpiar los efectos después de la animación
        setTimeout(() => {
            effectElements.forEach(effect => effect.remove());
            styleSheet.remove();
        }, 5000);
    }
    
    // Modificar el método showMessage para usar el nuevo efecto
    showMessage(message) {
        const messageDiv = document.createElement('div');
        const isHero = this.state.currentTurn === 'player1';
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${isHero ? 'rgba(0, 0, 0, 0.9)' : 'rgba(46, 139, 87, 0.9)'};
            color: ${isHero ? '#ffd700' : '#ffffff'};
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            z-index: 1000;
            animation: messagePopup 0.5s ease-out;
            border: 2px solid ${isHero ? '#ffd700' : '#1dcd16'};
            box-shadow: 0 0 20px ${isHero ? 'rgba(255, 215, 0, 0.5)' : 'rgba(29, 205, 22, 0.5)'};
        `;
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // Crear los efectos de victoria temáticos
        this.createVictoryEffect();
        
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.5s ease-in forwards';
            setTimeout(() => messageDiv.remove(), 500);
        }, 3000);
    }
    
    // Corregir el problema del parpadeo en la previsualización
    drawHoverPreview() {
        if (this.state.hoverColumn === null || this.state.isGameOver || 
            this.state.pieces.some(p => p.isAnimating)) return;
    
        const row = this.getLowestEmptyRow(this.state.hoverColumn);
        if (row === -1) return;
    
        const x = (this.state.hoverColumn * this.config.cellSize) + (this.config.cellSize / 2);
        const y = (row * this.config.cellSize) + (this.config.cellSize / 2);
    
        this.ctx.globalAlpha = 0.3;
        // Usar siempre el turno actual para la previsualización
        this.drawPiece(x, y, this.state.currentTurn);
        this.ctx.globalAlpha = 1;
    }
    
    // Mejorar el efecto de humo para que sea más temático
    drawSmoke() {
        const time = Date.now() * 0.001;
        const smokeParticles = 8;
        
        for (let i = 0; i < smokeParticles; i++) {
            const x = Math.sin(time + i * 2.0) * (this.canvas.width / 3) + this.canvas.width / 2;
            const y = Math.cos(time + i * 1.5) * (this.canvas.height / 3) + this.canvas.height / 2;
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 150);
            
            // Color del humo basado en el turno actual
            const smokeColor = this.state.currentTurn === 'player1' ? 
                'rgba(169, 169, 169, 0.03)' : // Humo gris para Batman
                'rgba(0, 255, 0, 0.02)';      // Humo verde para Joker
                
            gradient.addColorStop(0, smokeColor);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 150, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    restart() {
        this.state.isGameOver = false;
        this.state.currentTurn = 'player1';
        this.state.pieces = [];
        this.initBoard();
        this.resetTimer();
        this.updateTurnIndicator();
    }
}

function initializeCharacterSelection() {
    const characterOptions = document.querySelectorAll('.character-option');

    characterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const player = this.dataset.player;
            const character = this.dataset.character;
            
            // Remover selección previa
            document.querySelectorAll(`.character-option[data-player="${player}"]`)
                .forEach(opt => opt.classList.remove('selected'));
            
            // Agregar nueva selección
            this.classList.add('selected');
            
            // Actualizar personaje seleccionado
            if (player === '1') {
                selectedCharacters.player1 = character;
                console.log('Player 1 selected:', character);
            } else {
                selectedCharacters.player2 = character;
                console.log('Player 2 selected:', character);
            }
        });
    });
}

function startGame() {
    const canvas = document.getElementById('game-board');
    const settings = document.querySelector('.settings');
    const gameInfo = document.querySelector('.game-info');
    const lineLengthSelect = document.getElementById('line-length');

    // Obtener el valor actual de lineLength
    lineLength = parseInt(lineLengthSelect.value);

    canvas.classList.remove('hidden');
    gameInfo.classList.remove('hidden');
    settings.classList.add('hidden');

    const options = {
        lineLength: lineLength,
        turnDuration: 60,
        player1Character: selectedCharacters.player1,
        player2Character: selectedCharacters.player2
    };

    // Destruir instancia anterior si existe
    if (game) {
        game.canvas.removeEventListener('click', game.handleClick);
        game.canvas.removeEventListener('mousemove', game.handleMouseMove);
    }

    // Crear nueva instancia
    game = new ConnectXGame('game-board', options);
}
function initializeGameUI() {
    const canvas = document.getElementById('game-board');
    const settings = document.querySelector('.settings');
    const gameInfo = document.querySelector('.game-info');
    const lineLengthSelect = document.getElementById('line-length');
  
    const lineLength = parseInt(lineLengthSelect.value);
  
    canvas.classList.remove('hidden');
    gameInfo.classList.remove('hidden');
    settings.classList.add('hidden');
  
    const options = {
      lineLength: lineLength,
      turnDuration: 60,
      player1Character: selectedCharacters.player1,
      player2Character: selectedCharacters.player2,
    };
  
    if (game) {
      game.canvas.removeEventListener('click', game.handleClick);
      game.canvas.removeEventListener('mousemove', game.handleMouseMove);
    }
  
    game = new ConnectXGame('game-board', options);
  }
  
  document.addEventListener('DOMContentLoaded', initializeGameUI);