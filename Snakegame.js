//Defining HTML elements
const board = document.getElementById('game-board');

let snake = [{ x: 10, y: 10 }];

//Draw game board. map, snake food
function draw() {
    board.innerHTML = '';
    drawSnake();
}

//Draw snake on game board
fuction drawSnake() {
    snake.forEach((segment) =>{
        const snakeElement = createGameElement('div', 'snake')
    })
}