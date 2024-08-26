

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const bubbleRadius = 20;
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
let bubbles = [];
let shooterBubble = createBubble(canvas.width / 2, canvas.height - bubbleRadius, getRandomColor());
let shooterAngle = 0;
let isShooting = false;
let level = 1;
let gameOver = false;
let gameWon = false;

// Function to create a new bubble with the given x, y, and color
function createBubble(x, y, color) {
    return { x, y, color, radius: bubbleRadius, dx: 0, dy: 0 };
}

// Function to draw a single bubble on the canvas
function drawBubble(bubble) {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    ctx.fillStyle = bubble.color;
    ctx.fill();
    ctx.closePath();
}

// Function to draw all bubbles, including the shooter bubble
function drawBubbles() {
    bubbles.forEach(drawBubble);
    drawBubble(shooterBubble);
}

// Function to get a random color for a bubble
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to update bubbles' positions and handle collisions
function updateBubbles() {
    if (isShooting) {
        shooterBubble.x += shooterBubble.dx;
        shooterBubble.y += shooterBubble.dy;

        // Check for collision with walls
        if (shooterBubble.x - shooterBubble.radius <= 0 || shooterBubble.x + shooterBubble.radius >= canvas.width) {
            shooterBubble.dx *= -1; // Reverse direction
        }

        // Check for collision with top of canvas or other bubbles
        if (shooterBubble.y - shooterBubble.radius <= 0 || detectCollision(shooterBubble)) {
            isShooting = false;
            bubbles.push(shooterBubble);
            shooterBubble = createBubble(canvas.width / 2, canvas.height - bubbleRadius, getRandomColor());
            removeMatchingBubbles();
        }
    }

    // Check if game over
    checkGameOver();
}

// Function to shoot the bubble in the desired direction
function shootBubble() {
    if (!isShooting && !gameOver && !gameWon) {
        isShooting = true;
        shooterBubble.dx = Math.cos(shooterAngle) * 6;
        shooterBubble.dy = -Math.sin(shooterAngle) * 6;
    }
}

// Function to detect collisions between bubbles
function detectCollision(bubble) {
    for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        const dx = b.x - bubble.x;
        const dy = b.y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < b.radius + bubble.radius) {
            return true;
        }
    }
    return false;
}

// Function to remove clusters of matching bubbles
function removeMatchingBubbles() {
    let groups = [];
    let visited = new Set();

    // Function to find connected bubbles of the same color
    function findGroup(bubble) {
        let group = [];
        let stack = [bubble];

        while (stack.length > 0) {
            let current = stack.pop();

            if (!visited.has(current)) {
                visited.add(current);
                group.push(current);

                // Check all neighboring bubbles
                bubbles.forEach((b) => {
                    const dx = b.x - current.x;
                    const dy = b.y - current.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < b.radius * 2 && b.color === current.color && !visited.has(b)) {
                        stack.push(b);
                    }
                });
            }
        }

        return group;
    }

    // Find all groups of connected bubbles of the same color
    bubbles.forEach((bubble) => {
        if (!visited.has(bubble)) {
            let group = findGroup(bubble);
            if (group.length >= 3) {
                groups.push(group);
            }
        }
    });

    // Remove all bubbles that are in groups of 3 or more
    if (groups.length > 0) {
        groups.forEach((group) => {
            bubbles = bubbles.filter((b) => !group.includes(b));
        });

        // Check if the game is won
        checkGameWon();
    }
}

// Function to check if the game is won (no more bubbles)
function checkGameWon() {
    if (bubbles.length === 0) {
        gameWon = true;
        alert('You win! Moving to the next level!');
        nextLevel();
    }
}

// Function to check if game over (bubbles reach the bottom)
function checkGameOver() {
    if (bubbles.some((bubble) => bubble.y + bubble.radius >= canvas.height)) {
        gameOver = true;
        alert('Game Over! Try again!');
    }
}

// Function to start the next level
function nextLevel() {
    level++;
    bubbles = [];
    generateLevelBubbles(level);
}

// Function to generate initial bubbles for levels
function generateLevelBubbles(level) {
    const rows = level + 3;
    const cols = Math.floor(canvas.width / (bubbleRadius * 2));
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = bubbleRadius + col * bubbleRadius * 2;
            let y = bubbleRadius + row * bubbleRadius * 2;
            let color = getRandomColor();
            bubbles.push(createBubble(x, y, color));
        }
    }
}

// Main game loop to clear canvas, draw elements, and update game state
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBubbles();
    updateBubbles();
    requestAnimationFrame(gameLoop);
}

// Add mouse movement event to aim the shooter
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const dx = mouseX - canvas.width / 2;
    const dy = canvas.height - mouseY;

    shooterAngle = Math.atan2(dy, dx);
});

// Initialize the game
function initGame() {
    generateLevelBubbles(level);
    gameLoop();
}

// Start the game
initGame();

// Display win or game over message
function showMessage(message) {
          const messageElement = document.createElement('div');
          messageElement.className = 'message';
          messageElement.textContent = message;
          document.body.appendChild(messageElement);
      }
      
      // Call this function in checkGameWon and checkGameOver
      function checkGameWon() {
          if (bubbles.length === 0) {
              gameWon = true;
              showMessage('You win! Moving to the next level!');
              setTimeout(nextLevel, 2000);
          }
      }
      
      function checkGameOver() {
          if (bubbles.some((bubble) => bubble.y + bubble.radius >= canvas.height)) {
              gameOver = true;
              showMessage('Game Over! Try again!');
          }
      }
      
      // Apply animation class when removing bubbles
      function removeMatchingBubbles() {
          let groups = [];
          let visited = new Set();
      
          function findGroup(bubble) {
              let group = [];
              let stack = [bubble];
      
              while (stack.length > 0) {
                  let current = stack.pop();
      
                  if (!visited.has(current)) {
                      visited.add(current);
                      group.push(current);
      
                      bubbles.forEach((b) => {
                          const dx = b.x - current.x;
                          const dy = b.y - current.y;
                          const distance = Math.sqrt(dx * dx + dy * dy);
      
                          if (distance < b.radius * 2 && b.color === current.color && !visited.has(b)) {
                              stack.push(b);
                          }
                      });
                  }
              }
      
              return group;
          }
      
          bubbles.forEach((bubble) => {
              if (!visited.has(bubble)) {
                  let group = findGroup(bubble);
                  if (group.length >= 3) {
                      groups.push(group);
                  }
              }
          });
      
          if (groups.length > 0) {
              groups.forEach((group) => {
                  group.forEach((bubble) => {
                      bubble.classList.add('bubble-pop');
                  });
      
                  setTimeout(() => {
                      bubbles = bubbles.filter((b) => !group.includes(b));
                      checkGameWon();
                  }, 500);
              });
          }
      }
      