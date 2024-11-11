document.addEventListener('DOMContentLoaded', () => {
    const board = new Board(); // Asegúrate de que la clase Board esté correctamente definida
    const game = new Game(board); // Asegúrate de que Game recibe el tablero correctamente
    const dragAndDrop = new DragAndDrop(game); // Asegúrate de que DragAndDrop recibe el juego correctamente

    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        game.start(); // Inicia el juego cuando el botón es presionado
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const game = new ConnectXGame('gameCanvas', {
        cellSize: 65,
        cols: 9,
        rows: 9,
        lineLength: 4,
        turnDuration: 60
    });
    
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        game.restart();
    });
});
