const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d')

const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'bird.png';

//Constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGTH = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

//Score and highScore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;

document.body.onkeyup = function(e) {
    birdVelocity = FLAP_SPEED;
}

document.addEventListener("touchstart", function() {
    birdVelocity = FLAP_SPEED;
})
gameContainer.addEventListener("click", function() {
    birdVelocity = FLAP_SPEED;
})

//restart game
document.getElementById('restart').addEventListener('click', function() {
    hideMenu();
    resetGame();
    loop();
})


function increaseScore() {
    // increase our counter when bird presses the pipes
    if (birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP ||
        birdY + BIRD_HEIGTH > pipeY + PIPE_GAP) && 
        !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Create bounding boxes for the bird and pipes

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGTH
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGTH,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGTH,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP 

    }

    //Check for collision with upper box
    if (birdBox.x + birdBox.width > topPipeBox.x && 
        birdBox.x < topPipeBox.x + topPipeBox.width && 
        birdBox.y < topPipeBox.y) {
            return true
    }

    //Check for collision with lover pipe box
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true
    }

    // check if bird hits boundaries
    if (birdY < 0 || birdY + BIRD_HEIGTH > canvas.height) {
        return true
    }
    
    return false
    
}

function hideMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');

}

//reset value
function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function showMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}




function endGame() {
    showMenu();
}

function loop() {
    //reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Flappy bird
    ctx.drawImage(flappyImg, birdX, birdY);

    //Draw pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //Add collision
    if (collisionCheck()) {
        endGame();
        return;
    }
    //move pipes
    pipeX -= 2;

    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    //Appy gravity
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop);
}
loop()