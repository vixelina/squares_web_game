export function resizeCanvas(canvas, SCREEN_HEIGHT, SCREEN_WIDTH) {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
}

export function endGame(page) {
    localStorage.setItem('finalScore', localStorage.getItem('score'));
  
    const username = localStorage.getItem('username');
    const finalScore = localStorage.getItem('score');
    localStorage.setItem('score', 0);
  
    if (username && finalScore != 0) {
      const gameData = {
        username: username,
        score: finalScore
      };
  
      fetch('http://localhost:3030/submit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to submit score');
          }
          return response.json();
        })
        .then(data => {
          console.log('Score uploaded successfully:', data);
        })
        .catch(error => {
          console.error('Error uploading score:', error);
        });
    } else {
      console.error('Username or score is missing');
    }
    
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.remove();
    }
    
    page('/game-end');
  }

export function loop(ctx, squares, cursor, SCREEN_HEIGHT, SCREEN_WIDTH) {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
    squares.forEach((square) => {
      square.move(SCREEN_HEIGHT, SCREEN_WIDTH);
      square.draw(cursor.x, cursor.y, cursor.width);
    });
  
    cursor.update();
    cursor.draw();
  
    requestAnimationFrame(() => loop(ctx, squares, cursor, SCREEN_WIDTH, SCREEN_HEIGHT));
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
export function randomSpeed(min, max) {
    let speed;
    do {
        speed = Math.random() * (max - min) + min;
    } while (Math.abs(speed) < 0.1);
    return speed;
  }