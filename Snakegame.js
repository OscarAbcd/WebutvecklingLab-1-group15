//Defining HTML elements
const board = document.getElementById('game-board');
const instructionsText = document.getElementById('instruction-text');

//Defining game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let GameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//Draw game board, map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
}

//Draw snake on game board
function drawSnake() {
    snake.forEach((segment) =>{
        const snakeElement = createGameElement('div', 'snake')
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

//Draw food on game board
function drawFood() {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

//Create game element
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Set position of game element
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

function move() {
    const head = { ...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;    
        case 'left':
            head.x--;
            break    
        case 'right':
            head.x++;
            break;
    }
    
    snake.unshift(head);

    //snake.pop();

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        clearInterval(); 
        GameInterval = setInterval( {} => {
            move();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

draw();

// setInterval(() => {
//     move();
//     draw();
// }, 200);

function startGame() {
    gameStarted = true;
}