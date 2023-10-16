import { createTitleScreen, toggleSound } from './ui.js';

// Define frame rate (60 FPS)
const targetFrameRate = 60;
const frameDelay = 1000 / targetFrameRate;

let frameCount = 0;
let lastSecond = performance.now();
let lastFrameTime = performance.now();

// Initialize a flag to track whether the circle is on screen
let isCircleOnScreen = false;

// Initialize circle position and velocity
let circleLeft = 0; // Initial position
let circleVelocity = 0; // Initial velocity

// Gravity parameters
const gravity = 9.8; // m/s^2
const pixelsPerMeter = 10; // Adjust for your game's scale

function gameLoop() {
    const now = performance.now();
    const elapsed = now - lastFrameTime;

    if (elapsed >= frameDelay) {
        lastFrameTime = now;

        // Update your game logic here

        // Apply gravity to the circle
        applyGravity();

        // Check for collision
        // checkCollision();

        // Redraw the screen
        redrawScreen();
    }

    // Request the next frame with a fixed delay
    setTimeout(gameLoop, frameDelay);
}

createTitleScreen();

const screenWidth = window.innerWidth; // Get the screen width
const initialCircleLeft = screenWidth / 2; // Set it to half of the screen width

// Define circleElement here, but don't assign it yet
let circleElement;

document.getElementById('option1').addEventListener('click', function() {
    // Remove all buttons from the screen
    const options = document.querySelector('.options');
    options.style.display = 'none';

    // Create a circle element
    circleElement = document.createElement('div');
    circleElement.classList.add('circle');
    circleElement.id = 'circle'; // Give it an id

    // Append the circle to the body
    document.body.appendChild(circleElement);
    isCircleOnScreen = true;
    circleLeft = initialCircleLeft; // Set the initial position
    circleVelocity = 0; // Reset velocity

    // Create a rectangle element
    const rectangle = document.createElement('div');
    rectangle.classList.add('rectangle');
    rectangle.id = 'rectangle'; // Give it an id

    // Append the rectangle to the body
    document.body.appendChild(rectangle);
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

    // Instead of moving the circle, call the checkGravity function
    checkGravity();

    // Update the FPS display
    updateFPS();
}

// Function to apply gravity to the circle
function applyGravity() {
    // Calculate the new velocity using the acceleration due to gravity
    circleVelocity += (gravity / pixelsPerMeter) * (frameDelay / 1000);

    // Update the circle's position based on the velocity (horizontally)
    circleLeft += circleVelocity;

    // Limit the circle's position to stay within the screen boundaries (horizontally)
    const maxWidth = screenWidth - circleElement.clientWidth;
    circleLeft = Math.min(circleLeft, maxWidth);
    circleLeft = Math.max(circleLeft, 0);

    // Update the circle's style
    circleElement.style.left = circleLeft + 'px';
}

// Function to check gravity (this will be called each frame)
function checkGravity() {
    // Apply gravity by calling applyGravity
    applyGravity();
}

// Function to update the FPS display
function updateFPS() {
    frameCount++;

    // Get the current timestamp
    const now = performance.now();

    if (now - lastSecond >= 1000) {
        // If 1 second has passed, update the FPS
        const fps = frameCount;
        const fpsElement = document.querySelector('.clock');
        fpsElement.textContent = `FPS: ${fps}`;

        frameCount = 0;
        lastSecond = now; // Update the lastSecond timestamp
    }
}
