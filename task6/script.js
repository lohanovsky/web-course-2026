const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const gameOverBox = document.getElementById("game-over");
const gameOverText = document.getElementById("game-over-text");
const restartButton = document.getElementById("restart-button");

const cellSize = 20;
const cellCount = 20;
const moveInterval = 150;

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let apple = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let lastMoveTime = 0;

function isOnSnake(x, y) {
  return snake.some(function (segment) {
    return segment.x === x && segment.y === y;
  });
}

function spawnApple() {
  const freeCells = [];

  for (let y = 0; y < cellCount; y++) {
    for (let x = 0; x < cellCount; x++) {
      if (!isOnSnake(x, y)) {
        freeCells.push({ x: x, y: y });
      }
    }
  }

  if (freeCells.length === 0) {
    gameOver = true;
    return;
  }

  const index = Math.floor(Math.random() * freeCells.length);
  apple = freeCells[index];
}

function checkCollision(head) {
  const hitWall = head.x < 0 || head.x >= cellCount || head.y < 0 || head.y >= cellCount;
  const hitSelf = isOnSnake(head.x, head.y);
  return hitWall || hitSelf;
}

function moveSnake() {
  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (checkCollision(head)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    spawnApple();
  } else {
    snake.pop();
  }
}

function update(currentTime) {
  if (gameOver) {
    return;
  }

  if (currentTime - lastMoveTime >= moveInterval) {
    lastMoveTime = currentTime;
    moveSnake();
  }
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
}

function draw() {
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(apple.x, apple.y, "#e74c3c");

  snake.forEach(function (segment, index) {
    const color = index === 0 ? "#2ecc71" : "#27ae60";
    drawCell(segment.x, segment.y, color);
  });
}

function showScore() {
  scoreText.textContent = "Счёт: " + score;
}

function showGameOver() {
  gameOverText.textContent = "Игра окончена. Счёт: " + score;
  gameOverBox.hidden = false;
}

function gameLoop(currentTime) {
  update(currentTime);
  draw();
  showScore();

  if (gameOver) {
    showGameOver();
    return;
  }

  requestAnimationFrame(gameLoop);
}

function resetGame() {
  snake = [
    { x: 7, y: 10 },
    { x: 6, y: 10 },
    { x: 5, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  lastMoveTime = performance.now();
  spawnApple();
}

function startGame() {
  resetGame();
  gameOverBox.hidden = true;
  requestAnimationFrame(gameLoop);
}

function handleKeyDown(event) {
  const newDirection = directions[event.key];

  if (!newDirection) {
    return;
  }

  event.preventDefault();

  const isOpposite = newDirection.x === -direction.x && newDirection.y === -direction.y;

  if (!isOpposite) {
    nextDirection = newDirection;
  }
}

document.addEventListener("keydown", handleKeyDown);
restartButton.addEventListener("click", startGame);

startGame();
