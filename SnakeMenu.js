// Function to hash the password using the SubtleCrypto API
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashedData = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashedData));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPassword; // Returns a hex string representation of the hash
}

// Function to send login request to the form check server without handling response
async function loginUser(username, password) {
    const hashedPassword = await hashPassword(password); // Hash password

    // Prepare form data to be sent
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', hashedPassword);

    try {
        // Send form data via HTTP to the form check URL (no response handling)
        await fetch('https://kihlman.eu/formcheck.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Send as form data
            },
            body: formData.toString(), // Convert form data to query string format
            mode: 'no-cors' // Fixes cors error, but no response can be read
        });

        console.log("Login attempt sent to the server."); // For debugging or confirmation
        document.getElementById('login-error').textContent = `Login attempt sent for user: ${username}`;

    } catch (error) {
        console.error('Error sending login data:', error);
        document.getElementById('login-error').textContent = `Error communicating with server: ${error.message}`;
    }
}

// Function to validate user credentials
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check against the hardcoded user
    if (username === "hacker" && password === "123") {
        console.log("Hardcoded user logged in successfully.");
        document.getElementById('login-error').textContent = ""; // Clear error message
        // Load the game after successful login
        showPage('game');
    } else {
        // Send login data to the server for other users
        loginUser(username, password);
    }
}

// Event listener for the login button
document.getElementById('login-btn').addEventListener('click', validateLogin);

// Function to show the selected page
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    
    // Loop through all pages and hide them
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');

        // Display highscores on the highscore page
        if (pageId === 'highscores') {
            displayHighScores();
        }
    }
}
//Defining HTML elements
const board = document.getElementById('game-board');
const instructionsText = document.getElementById('instructions-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');

//Defining game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = localStorage.getItem('highscore') ? parseInt(localStorage.getItem('highscore')) : 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//Highscores updating, displaying and saving top 5 highscores
let highScores = JSON.parse(localStorage.getItem('highScores')) || []; // Get highscores from local storage

function updateHighScores(currentScore) {
    // Check if the current score is in the top 5 highscores
    if (highScores.length < 5 || currentScore > highScores[highScores.length - 1]) {
        // Add the current score to the highscores array
        highScores.push(currentScore);
        // Sort the highscores array in descending order
        highScores.sort((a, b) => b - a);
        // Keep only the top 5 highscores
        if (highScores.length > 5) {
            highScores.pop();
        }
    // Save the highscores array to local storage
    localStorage.setItem('highScores', JSON.stringify(highScores));
    }
}
function displayHighScores() {
    // Clear the highscores list
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';

    // Loop through the highscores array and display each score
    highScores.forEach((score, index) => {
        const listItem = document.createElement('li');
        // Display the score with leading zeros
        listItem.textContent = `${score.toString().padStart(3, '0')}`;
        scoreList.appendChild(listItem);
    });
}

// Call at end of game to update highscores
function endGame() { 
    updateHighScores(highScore);
    displayHighScores();
}


//Draw game board, map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
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
    if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
    }
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

//Generate food at random position
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

//Move snake
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

    //check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); 
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

function startGame() {
    gameStarted = true;
    instructionsText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function handleKeyPress(event) {
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.code === ' ')) {
        startGame();
    } else {
        switch (event.code) {
            case 'ArrowUp':
              direction = 'up';
              break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    } else if (gameSpeedDelay > 20) {
        gameSpeedDelay -= 0;
    }
}

function checkCollision() {
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for(let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

highScoreText.textContent = highScore.toString().padStart(3, '0');
highScoreText.style.display = highScore > 0 ? 'none' : 'block';

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
        localStorage.setItem('highscore', highScore);
    }
    highScoreText.style.display = 'block';
}


function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionsText.style.display = 'block';
    logo.style.display = 'block';
}

function resetGame() {
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;

    instructionsText.style.display = 'block';
    logo.style.display = 'block';

    updateScore();
    draw();
}

// function updateHighScore() {
//     const currentScore = snake.length - 1;
//     if (currentScore > highScore) {
//         highScore = currentScore;
//         highScoreText.textContent = highScore.toString().padStart(3, '0');
        
//     }
//     highScoreText.style.display = 'block';
// }
