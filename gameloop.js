import { createTitleScreen, toggleSound } from './ui.js';

// Define frame rate (60 FPS)
const targetFrameRate = 60;
const frameDelay = 1000 / targetFrameRate;

// Initialize last frame timestamp
let lastTimestamp = 0;

// Initialize a flag to track whether the circle is on screen
let isCircleOnScreen = false;

function gameLoop(timestamp) {
    // Calculate the time elapsed since the last frame
    const elapsed = timestamp - lastTimestamp;

    // Update your game logic here

    // Check for collision
    //checkCollision();

    // Redraw the screen
    redrawScreen();

    // Request the next frame
    requestAnimationFrame(gameLoop);

    // Update the last frame timestamp
    lastTimestamp = timestamp;
}

createTitleScreen();

const screenWidth = window.innerWidth; // Get the screen width
const initialCircleLeft = screenWidth / 2; // Set it to half of the screen width

// Create a circle element
const circle = document.createElement('div');
circle.classList.add('circle');
circle.id = 'circle'; // Give it an id

document.getElementById('option1').addEventListener('click', function() {

    // Remove all buttons from the screen
    const options = document.querySelector('.options');
    options.style.display = 'none';

    // Append the circle to the body
    document.body.appendChild(circle);
    isCircleOnScreen = true;

    // Create a rectangle element
    const rectangle = document.createElement('div');
    rectangle.classList.add('rectangle');
    rectangle.id = 'rectangle'; // Give it an id

    // Append the rectangle to the body
    document.body.appendChild(rectangle);
    gameLoop(0); // Start the game loop
});

document.getElementById('option2').addEventListener('click', function() {
});
document.getElementById('option3').addEventListener('click', function() {
});
document.getElementById('option4').addEventListener('click', function() {
    toggleSound();
});

// Check for collision
function checkCollision() {
    const rectangleElement = document.getElementById('rectangle');
    const circleElement = document.getElementById('circle');

    const rect = rectangleElement.getBoundingClientRect();
    const circle = circleElement.getBoundingClientRect();

    if (
        rect.right >= circle.left &&
        rect.left <= circle.right &&
        rect.bottom >= circle.top &&
        rect.top <= circle.bottom
    ) {
        // Collisions detected, you can add your collision handling code here
    }
}

// Redraw the screen (implement your redraw logic)
function redrawScreen() {
    // Ensure that the circle is on the screen before updating its position
    if (!isCircleOnScreen) {
        return;
    }

    const circleElement = document.getElementById('circle');
    const rectangleElement = document.getElementById('rectangle');

    const circleLeft = parseInt(circleElement.style.left, 10) || initialCircleLeft;

    const newLeft = circleLeft + 1; // Move 1 pixel to the right

    // Update the position of the circle
    circleElement.style.left = newLeft + 'px';

    // Check if the circle has gone beyond the right boundary and reset it
    if (newLeft > window.innerWidth) {
        circleElement.style.left = '0';
    }
}

// Request the first frame
requestAnimationFrame(gameLoop);
