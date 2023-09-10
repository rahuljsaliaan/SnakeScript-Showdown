// * Game constant and var

const maxGrid = 18;
const minGrid = 0;
const initialPosition = { x: 13, y: 13 };
const initialFoodPosition = { x: 13, y: 8 };
const initialInputDirection = { x: 0, y: 0 };
const framesSpeed = 5;

let snakeArr = [{ ...initialPosition }];
let food = { ...initialFoodPosition };
let inputDirection = { ...initialInputDirection };
let lastPaintTime = 0;
let score = 0;

const musicSound = new Audio("assets/sounds/music.mp3");
const moveSound = new Audio("assets/sounds/move.mp3");
const foodSound = new Audio("assets/sounds/food.mp3");
const gameOverSound = new Audio("assets/sounds/gameover.mp3");

// * HTML elements
const board = document.querySelector("#board");
console.log(board);

// * Util Functions
function randomFoodLocation(a, b) {
  return Math.round(Math.random() * (a + (b - a)));
}

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
  console.log("game engine running");
  if (isCollide(snakeArr)) {
    musicSound.pause();
    gameOverSound.play();

    alert("GAME OVER...!, click on any button");

    // Rest the snake size and position
    snakeArr = [{ ...initialPosition }];
    food = { ...initialFoodPosition };
    inputDirection = { ...initialInputDirection };

    score = 0;
  }

  // 1. a.Increment the size of snake if collides with food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    snakeArr.unshift({ x: food.x, y: food.y });
    food.x = randomFoodLocation(2, 16);
    food.y = randomFoodLocation(2, 16);
  }

  // b.move the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    console.log(i);
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

    default:
      return;
  }
});
