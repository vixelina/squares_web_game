import page from "../node_modules/page/page.mjs";
//import Cursor from './modules/CursorClass.js';
//import Square from './modules/SquareClass.js';
import { resizeCanvas, endGame, randomInt, randomSpeed } from './modules/functions.js'
import { mouse } from './modules/data.js'

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CURSOR_SIZE = 50;
const SQUARE_SIZE = 30;
const NUM_SQUARES = 15;

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

// resize to window size
window.addEventListener('resize', resizeCanvas);
resizeCanvas(canvas, SCREEN_HEIGHT, SCREEN_WIDTH);

class Square {
  constructor() {
    this.x = randomInt(0, SCREEN_WIDTH - SQUARE_SIZE);
    this.y = randomInt(0, SCREEN_HEIGHT - SQUARE_SIZE);
    this.width = SQUARE_SIZE;
    this.height = SQUARE_SIZE;
    this.speedX = randomSpeed(-2, 2);
    this.speedY = randomSpeed(-2, 2);
    this.color = 'rgb(153, 60, 7)';
  }

  isColliding(cursorX, cursorY, cursorSize) {
    const cursorLeft = cursorX;
    const cursorRight = cursorX + cursorSize;
    const cursorTop = cursorY;
    const cursorBottom = cursorY + cursorSize;
  
    const squareLeft = this.x;
    const squareRight = this.x + this.width;
    const squareTop = this.y;
    const squareBottom = this.y + this.height;
  
    return !(cursorRight < squareLeft || cursorLeft > squareRight || cursorBottom < squareTop || cursorTop > squareBottom);
  }
  

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // if hit wall, bounce
    if (this.x <= 0 || this.x + this.width >= SCREEN_WIDTH) {
      this.speedX *= -1;
    }
    if (this.y <= 0 || this.y + this.height >= SCREEN_HEIGHT) {
      this.speedY *= -1;
    }
  }

  draw(cursorX, cursorY, cursorSize) {
    if (this.isColliding(cursorX, cursorY, cursorSize)) {
      this.color = 'rgb(241, 133, 10)';
    } else {
      this.color = 'rgb(153, 60, 7)';
    }
  
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }  
}

// cursor
class Cursor {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = CURSOR_SIZE;
    this.height = CURSOR_SIZE;
  }

  update() {
    this.x = mouse.x - this.width / 2;
    this.y = mouse.y - this.height / 2;
  }

  draw() {
    const borderThickness = 2;
    const centerSquareSize = 5;
  
    const imageData = ctx.getImageData(
      this.x - borderThickness,
      this.y - borderThickness,
      this.width + borderThickness * 2,
      this.height + borderThickness * 2
    );
    const data = imageData.data;
  
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const isTopBorder = y < borderThickness;
        const isBottomBorder = y >= imageData.height - borderThickness;
        const isLeftBorder = x < borderThickness;
        const isRightBorder = x >= imageData.width - borderThickness;
        
        const isCenterX = x >= (imageData.width - centerSquareSize) / 2 && x < (imageData.width + centerSquareSize) / 2;
        const isCenterY = y >= (imageData.height - centerSquareSize) / 2 && y < (imageData.height + centerSquareSize) / 2;
        const isCenter = isCenterX && isCenterY;
  
        if (isTopBorder || isBottomBorder || isLeftBorder || isRightBorder || isCenter) {
          const index = (y * imageData.width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];
  
          if (isCenter) {
            data[index    ] = 255; // r
            data[index + 1] = 255; // g
            data[index + 2] = 255; // b
            data[index + 3] = 255; // a
          } else if ((r == 0 && g == 0 && b == 0) || a == 0) {
            data[index    ] = 255; // r
            data[index + 1] = 255; // g
            data[index + 2] = 255; // b
            data[index + 3] = 255; // a
          } else {
            data[index    ] = 255 - r;
            data[index + 1] = 255 - g;
            data[index + 2] = 255 - b;
          }
        }
      }
    }

    ctx.putImageData(imageData, this.x - borderThickness, this.y - borderThickness);
  }
}

// init
let squares = [];
for (let i = 0; i < NUM_SQUARES; i++) {
  squares.push(new Square());
}
const cursor = new Cursor();
mouse.x = 0;
mouse.y = 0;

// mouse pos
window.addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener('click', function () {
  let removedCount = 0;

  squares = squares.filter((square) => {
      if (square.isColliding(cursor.x, cursor.y, cursor.width)) {
          removedCount++;
          return false;
      }
      return true;
  });

  if (removedCount == 0) {
      endGame(page);
      return;
  }

  //score += removedCount;
  localStorage.setItem('score', parseInt(localStorage.getItem('score')) + removedCount);

  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) {
      scoreDisplay.innerHTML = `Score: ${localStorage.getItem('score')}`;
  }

  while (removedCount > 0) {
      squares.push(new Square());
      removedCount--;
  }
});

function loop() {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  squares.forEach((square) => {
    square.move();
    square.draw(cursor.x, cursor.y, cursor.width);
  });

  cursor.update();
  cursor.draw();

  requestAnimationFrame(loop);
}

loop();
