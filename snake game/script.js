const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 100, y: 100 }];
let direction = { x: gridSize, y: 0 };
let food = getRandomFoodPosition();
let score = 0;
let gameOver = false;
let gamePaused = false;

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const restartButtonGameOver = document.getElementById("restartButtonGameOver");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("finalScore");
const gameOverScreen = document.getElementById("gameOverScreen");

function getRandomFoodPosition() {
    let foodX = Math.floor((Math.random() * canvasSize) / gridSize) * gridSize;
    let foodY = Math.floor((Math.random() * canvasSize) / gridSize) * gridSize;
    return { x: foodX, y: foodY };
}

function drawSnake() {
    ctx.fillStyle = "#00ff00";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
        score++;
        scoreDisplay.textContent = score;
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snakeCollision(head)) {
        gameOver = true;
        finalScoreDisplay.textContent = score;
        gameOverScreen.classList.add("active");
    }
}

function snakeCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = direction.y === -gridSize;
    const goingDown = direction.y === gridSize;
    const goingRight = direction.x === gridSize;
    const goingLeft = direction.x === -gridSize;

    if (keyPressed === LEFT && !goingRight) {
        direction = { x: -gridSize, y: 0 };
    }
    if (keyPressed === UP && !goingDown) {
        direction = { x: 0, y: -gridSize };
    }
    if (keyPressed === RIGHT && !goingLeft) {
        direction = { x: gridSize, y: 0 };
    }
    if (keyPressed === DOWN && !goingUp) {
        direction = { x: 0, y: gridSize };
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    if (gameOver) return;

    if (!gamePaused) {
        clearCanvas();
        drawFood();
        updateSnake();
        drawSnake();
    }

    setTimeout(gameLoop, 100);
}

startButton.addEventListener("click", () => {
    gameOver = false;
    gamePaused = false;
    score = 0;
    snake = [{ x: 100, y: 100 }];
    direction = { x: gridSize, y: 0 };
    food = getRandomFoodPosition();
    scoreDisplay.textContent = score;
    gameOverScreen.classList.remove("active");
    gameLoop();
});

pauseButton.addEventListener("click", () => {
    gamePaused = !gamePaused;
});

restartButton.addEventListener("click", () => {
    gameOver = false;
    gamePaused = false;
    score = 0;
    snake = [{ x: 100, y: 100 }];
    direction = { x: gridSize, y: 0 };
    food = getRandomFoodPosition();
    scoreDisplay.textContent = score;
    gameOverScreen.classList.remove("active");
    gameLoop();
});

restartButtonGameOver.addEventListener("click", () => {
    gameOver = false;
    gamePaused = false;
    score = 0;
    snake = [{ x: 100, y: 100 }];
    direction = { x: gridSize, y: 0 };
    food = getRandomFoodPosition();
    scoreDisplay.textContent = score;
    gameOverScreen.classList.remove("active");
    gameLoop();
});

document.addEventListener("keydown", changeDirection);
