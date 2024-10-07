//Defining HTML elements
const board = document.getElementById('game-board');

//Defining game variables
let snake = [{ x: 10, y: 10 }];

//Draw game board. map, snake food
function draw() {
    board.innerHTML = '';
    drawSnake();
}

//Draw snake on game board
function drawSnake() {
    snake.forEach((segment) =>{
        const snakeElement = createGameElement('div', 'snake')
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

//Create game element
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Set position of game element
function setPosition(element, position) {
    element.style.gridRow = position.y;
    element.style.gridColumn = position.x;
}