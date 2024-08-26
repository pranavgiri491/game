document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const width = 8;
    const squares = [];
    let score = 0;

    const candyColors = [
        'blue', 'red', 'yellow', 'green', 'purple', 'orange'
    ];

    // Create the board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.classList.add('candy', candyColors[randomColor]);
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    // Dragging the candies
    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));

    function dragStart() {
        colorBeingDragged = this.className;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragEnd() {
        // Valid moves
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];

        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].className = colorBeingReplaced;
            squares[squareIdBeingDragged].className = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].className = colorBeingDragged;
        }
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.className = '';
    }

    function dragDrop() {
        colorBeingReplaced = this.className;
        squareIdBeingReplaced = parseInt(this.id);
        squares[squareIdBeingDragged].className = colorBeingReplaced;
        squares[squareIdBeingReplaced].className = colorBeingDragged;
    }

    // Checking for matches
    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            let rowOfThree = [i, i+1, i+2];
            let decidedColor = squares[i].className;
            const isBlank = squares[i].className === '';

            if (rowOfThree.every(index => squares[index].className === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.textContent = `Score: ${score}`;
                rowOfThree.forEach(index => {
                    squares[index].className = '';
                });
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            let columnOfThree = [i, i+width, i+width*2];
            let decidedColor = squares[i].className;
            const isBlank = squares[i].className === '';

            if (columnOfThree.every(index => squares[index].className === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.textContent = `Score: ${score}`;
                columnOfThree.forEach(index => {
                    squares[index].className = '';
                });
            }
        }
    }

    function moveIntoSquareBelow() {
        for (let i = 0; i < 56; i++) {
            if (squares[i + width].className === '') {
                squares[i + width].className = squares[i].className;
                squares[i].className = '';
            }
        }
    }

    function generateCandies() {
        for (let i = 0; i < 8; i++) {
            if (squares[i].className === '') {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].className = 'candy ' + candyColors[randomColor];
            }
        }
    }

    // Check for matches and update the board
    window.setInterval(function() {
        moveIntoSquareBelow();
        generateCandies();
        checkRowForThree();
        checkColumnForThree();
    }, 100);
});
// Modify moveIntoSquareBelow function to add falling animation
function moveIntoSquareBelow() {
    for (let i = 0; i < 56; i++) {
        if (squares[i + width].className === '') {
            squares[i + width].className = squares[i].className;
            squares[i].classList.remove('falling'); // Remove previous falling class
            squares[i].className = '';
            squares[i + width].classList.add('falling'); // Add falling animation
        }
    }
}

// Update dragEnd function to add swapping animation
function dragEnd() {
    // Check if valid move
    let validMoves = [
        squareIdBeingDragged - 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + 1,
        squareIdBeingDragged + width
    ];

    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
        squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
        squares[squareIdBeingReplaced].className = colorBeingReplaced;
        squares[squareIdBeingDragged].className = colorBeingDragged;
    } else {
        squares[squareIdBeingDragged].className = colorBeingDragged;
    }

    // Adding swap animation
    squares[squareIdBeingDragged].style.transform = 'scale(1.1)';
    squares[squareIdBeingReplaced].style.transform = 'scale(1.1)';
    setTimeout(() => {
        squares[squareIdBeingDragged].style.transform = 'scale(1)';
        squares[squareIdBeingReplaced].style.transform = 'scale(1)';
    }, 300);
}

function createSpecialCandy(index, type) {
    squares[index].className = 'candy ' + type;
    squares[index].style.border = '2px solid gold'; // Make special candies stand out
    squares[index].style.animation = 'powerupGlow 1s infinite alternate'; // Add glow effect
}



// enhNCE JS ANIMATION
function dragEnd() {
    // Valid moves
    let validMoves = [
        squareIdBeingDragged - 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + 1,
        squareIdBeingDragged + width
    ];

    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
        squareIdBeingReplaced = null;
        playSwapSound();
    } else if (squareIdBeingReplaced && !validMove) {
        squares[squareIdBeingReplaced].className = colorBeingReplaced;
        squares[squareIdBeingDragged].className = colorBeingDragged;
    } else {
        squares[squareIdBeingDragged].className = colorBeingDragged;
    }

    // Reset styles after swap
    squares.forEach(square => {
        square.style.transform = 'scale(1)';
    });
}

// Update checkRowForThree and checkColumnForThree to add matched animation
function checkRowForThree() {
    for (let i = 0; i < 61; i++) {
        let rowOfThree = [i, i+1, i+2];
        let decidedColor = squares[i].className;
        const isBlank = squares[i].className === '';

        if (rowOfThree.every(index => squares[index].className === decidedColor && !isBlank)) {
            score += 3;
            scoreDisplay.textContent = `Score: ${score}`;
            rowOfThree.forEach(index => {
                squares[index].classList.add('matched'); // Add animation class
                setTimeout(() => {
                    squares[index].className = ''; // Clear after animation
                }, 500);
            });

            playMatchSound();
        }
    }
}
// AUDIO
const bgMusic = document.getElementById('bg-music');



// Play button functionality
document.getElementById("play-button").addEventListener("click", startGame);

function startGame() {
  score = 0;
  document.getElementById("score").innerText = `Score: ${score}`;
  grid.forEach((candy) => {
    candy.remove();
  });
  grid = [];
  for (let i = 0; i < 64; i++) {
    let candy = document.createElement("div");
    candy.className = `candy ${candyColors[Math.floor(Math.random() * candyColors.length)]}`;
    grid.push(candy);
    document.getElementById("grid").appendChild(candy);
  }
  grid.forEach((candy) => {
    candy.addEventListener("click", checkForMatch);
  });
}