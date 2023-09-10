// * Game constant and var

const maxGrid = 18;
const minGrid = 0;
const maxPointIncrement = 10;
const maxSpeedIncrement = 0.2;
const minFoodGrid = 2;
const maxFoodGrid = 16;
const initialPosition = { x: 13, y: 13 };
const initialFoodPosition = { x: 13, y: 8 };
const initialInputDirection = { x: 0, y: 0 };
const soundOnIcon = "🔊";
const soundOffIcon = "🔈";
let framesSpeed = 5;

let snakeArr = [{ ...initialPosition }];
let food = { ...initialFoodPosition };
let inputDirection = { ...initialInputDirection };
let lastPaintTime = 0;
let score = 0;
let playMusic = false;

const musicSound = new Audio("assets/sounds/music.mp3");
const moveSound = new Audio("assets/sounds/move.mp3");
const foodSound = new Audio("assets/sounds/food.mp3");
const gameOverSound = new Audio("assets/sounds/gameover.mp3");

// * HTML elements
const board = document.querySelector("#board");
const btnReset = document.querySelector("#btn-reset");
const btnSound = document.querySelector("#btn-sound");
const soundIcon = btnSound.querySelector("#sound-icon");
const scoreBoard = document.querySelector("#score-board");
const scorePoints = scoreBoard.querySelector("#score-points");

// * Util Functions
function randomFoodLocation(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function reset() {
  musicSound.pause();
  snakeArr = [{ ...initialPosition }];
  food = { ...initialFoodPosition };
  inputDirection = { ...initialInputDirection };
  score = 0;
}

btnReset.addEventListener("click", () => {
  reset();
});

btnSound.addEventListener("click", () => {
  playMusic = !playMusic;

  if (playMusic) {
    soundIcon.innerHTML = soundOnIcon;
    musicSound.play();
  } else {
    soundIcon.innerHTML = soundOffIcon;
    musicSound.pause();
  }
});

// * Game Functions
function main(currentTime) {
  window.requestAnimationFrame(main);
  if ((currentTime - lastPaintTime) / 1000 < 1 / framesSpeed) return;
  lastPaintTime = currentTime;

  gameEngine();
}

function isCollide(snakeArr) {
  // If snake collides into itself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y)
      return true;
  }

  if (
    snakeArr[0].x >= maxGrid ||
    snakeArr[0].x <= minGrid ||
    snakeArr[0].y >= maxGrid ||
    snakeArr[0].y <= minGrid
  )
    return true;

  return false;
}

function gameEngine() {
  if (isCollide(snakeArr)) {
    musicSound.pause();
    gameOverSound.play();

    alert("GAME OVER...!, click on any button");

    // Rest the snake size and position
    reset();
  }

  // 1. a.Increment the size of snake and score if it collides with food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    snakeArr.unshift({ x: food.x, y: food.y });
    foodSound.play();
    score += maxPointIncrement;
    framesSpeed += maxSpeedIncrement;
    food.x = randomFoodLocation(minFoodGrid, maxFoodGrid);
    food.y = randomFoodLocation(minFoodGrid, maxFoodGrid);
  }

  // b.move the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDirection.x;
  snakeArr[0].y += inputDirection.y;

  // * clear the board before rendering to avoid previous render being displayed
  board.innerHTML = "";

  // 2. Render the snake
  snakeArr.forEach((snake, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = snake.y;
    snakeElement.style.gridColumnStart = snake.x;

    index === 0
      ? snakeElement.classList.add("snake-head")
      : snakeElement.classList.add("snake-body");

    board.appendChild(snakeElement);
  });

  // 3. Render food
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;

  foodElement.classList.add("food");

  board.appendChild(foodElement);

  // 4. Render score
  scorePoints.textContent = score;
}

// * Game Logic
window.requestAnimationFrame(main);

window.addEventListener("keyup", (e) => {
  // * important code
  inputDirection.x = inputDirection.y = 0;

  moveSound.play();

  switch (e.key) {
    case "ArrowUp":
      inputDirection.x = 0;
      inputDirection.y = -1;
      break;

    case "ArrowDown":
      inputDirection.x = 0;
      inputDirection.y = 1;
      break;

    case "ArrowLeft":
      inputDirection.x = -1;
      inputDirection.y = 0;
      break;

    case "ArrowRight":
      inputDirection.x = 1;
      inputDirection.y = 0;
      break;

    case "Escape":
      reset();
      break;

    default:
      return;
  }
});
