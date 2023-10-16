import { createTitleScreen, toggleSound } from './ui.js';

// Define frame rate (120 FPS)
const targetFrameRate = 60;
const frameDelay = 1000 / targetFrameRate;

// Adjust pixelsPerMeter based on frame rate and gravity
const gravity = 9.8; // m/s^2
const pixelsPerMeter = (frameDelay / 1000) * targetFrameRate / gravity * 10;

let frameCount = 0;
let lastSecond = performance.now();
let lastFrameTime = performance.now();

// Initialize a flag to track whether the circle is on screen
let isCircleOnScreen = false;
let circleTop;

// Initialize circle position and velocity
let circleVelocity = 0; // Initial velocity
const coefficientOfRestitution = 0.6; // Adjust as needed
const energyLossFactor = 0.9; // Adjust to control energy loss (should be less than 1)

function gameLoop() {
    const now = performance.now();
    const elapsed = now - lastFrameTime;

    if (elapsed >= frameDelay) {
        lastFrameTime = now;

        // Update your game logic here

        // Apply gravity to the circle
        applyGravity();

        // Check for collision
        if (checkCollision()) {
            // If a collision is detected, bounce the circle and reduce energy
            console.log("collision!");
            circleVelocity = -circleVelocity * coefficientOfRestitution; // Bounce with opposite velocity
            circleVelocity *= energyLossFactor; // Reduce energy
            circleElement.style.top = circleTop + 'px'; // Update the circle's style
        }

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

    // Create a rectangle element
    const rectangle = document.createElement('div');
    rectangle.classList.add('rectangle');
    rectangle.id = 'rectangle'; // Give it an id

    // Append the rectangle to the body
    document.body.appendChild(rectangle);

    // Create a circle element
    circleElement = document.createElement('div');
    circleElement.classList.add('circle');
    circleElement.id = 'circle'; // Give it an id

    // Append the circle to the body
    document.body.appendChild(circleElement);
    isCircleOnScreen = true;
    circleVelocity = 0; // Reset velocity

    // Calculate circleTop based on the rectangle's position and dimensions
    const rectangleTop = rectangle.offsetTop;
    const rectangleHeight = rectangle.clientHeight;
    circleTop = rectangleHeight - circleElement.clientHeight;

    gameLoop();
});

document.getElementById('option2').addEventListener('click', function() {
});
document.getElementById('option3').addEventListener('click', function() {
});
document.getElementById('option4').addEventListener('click', function() {
    toggleSound();
});

let previousCircleTop = circleTop;

function checkCollision() {
    const rectangleElement = document.getElementById('rectangle');
    const rect = rectangleElement.getBoundingClientRect();
    const circle = circleElement.getBoundingClientRect();
    const collision =
        rect.right <= circle.right ||
        rect.left >= circle.left ||
        rect.bottom <= circle.bottom ||
        rect.top >= circle.top;

    if (collision) {
        // Collision detected, reset the circle's position to the previous position
        circleTop = previousCircleTop;
        circleElement.style.top = circleTop + 'px';
        circleVelocity *= energyLossFactor; // Reduce energy
    } else {
        // Update the previous position when no collision is detected
        previousCircleTop = circleTop;
    }

    return collision;
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

    // Calculate the circle's potential new position based on the velocity
    const potentialCircleTop = circleTop + circleVelocity;

    // Limit the circle's position to stay within the screen boundaries (vertically)
    const maxHeight = window.innerHeight - circleElement.clientHeight;
    circleTop = Math.min(potentialCircleTop, maxHeight);
    circleTop = Math.max(circleTop, 0);

    // Update the circle's style
    circleElement.style.top = circleTop + 'px';

    if (potentialCircleTop > maxHeight) {
        // If the potential new position exceeds the screen bottom, stop the circle
        circleVelocity = -circleVelocity * coefficientOfRestitution; // Bounce with opposite velocity
        circleVelocity *= energyLossFactor; // Reduce energy
        circleTop = maxHeight;
        circleElement.style.top = circleTop + 'px';
    }
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
