import {createTitleScreen, toggleSound, getContainerWidth, getContainerHeight, container} from './ui.js';

// Define frame rate (60 FPS)
const targetFrameRate = 60;
const frameDelay = 1000 / targetFrameRate;


// Adjust pixelsPerMeter based on frame rate and gravity
const gravity = 9.8; // m/s^2
const pixelsPerMeter = (frameDelay / 1000) * targetFrameRate / (gravity * 100);


let frameCount = 0;
let lastSecond = performance.now();
let lastFrameTime = performance.now();
let areCirclesOnScreen = false;

let circles = [];
const numCircles = 100; // Number of circles to create
const coefficientOfRestitution = 0.6; // Adjust as needed
const energyLossFactor = 0.90; // Adjust to control energy loss (should be less than 1)

function gameLoop() {
    const now = performance.now();
    const elapsed = now - lastFrameTime;

    if (elapsed >= frameDelay) {
        lastFrameTime = now;

        // Apply gravity and check collisions for each circle
        for (let i = 0; i < numCircles; i++) {
            const circleElement = circles[i];

            // Apply gravity to the circle
            applyGravity(circleElement);

            // Check for collision
            if (checkCollision(circleElement)) {
            }
        }

        // Redraw the screen
        redrawScreen();
    }

    // Request the next frame with a fixed delay
    setTimeout(gameLoop, frameDelay);
}

createTitleScreen();

document.getElementById('option1').addEventListener('click', function () {
    // Remove all buttons from the screen
    const options = document.querySelector('.options');
    options.style.display = 'none';
    container.style.display = "flex";
    let containerWidth = getContainerWidth();
    let containerHeight = getContainerHeight();

    createCircles(containerWidth, containerHeight);

    areCirclesOnScreen = true;

    gameLoop();
});

document.getElementById('option2').addEventListener('click', function () {
});
document.getElementById('option3').addEventListener('click', function () {
});
document.getElementById('option4').addEventListener('click', function () {
    toggleSound();
});

let previousCircleTop = [];

function checkCollision(circleElement) {
    const container = document.getElementById('container');
    const containerRect = container.getBoundingClientRect();
    const circleRect = circleElement.getBoundingClientRect();

    const collision =
        circleRect.right <= containerRect.right ||
        circleRect.left >= containerRect.left ||
        circleRect.bottom <= containerRect.bottom ||
        circleRect.top >= containerRect.top;

    if (collision) {
        // Collision detected, reset the circle's position to the previous position
        circleElement.style.top = previousCircleTop[circles.indexOf(circleElement)] + 'px';
        // Handle collision for each circle as needed
    } else {
        // Update the previous position when no collision is detected
        previousCircleTop[circles.indexOf(circleElement)] = parseFloat(circleElement.style.top);
    }

    return collision;
}


function createCircles(maxWidth, maxHeight) {

    for (let i = 0; i < numCircles; i++) {
        const circleElement = document.createElement('div');
        circleElement.classList.add('circle');
        circleElement.setAttribute('data-velocity', 0); // Initialize velocity to 0
        circleElement.setAttribute('data-bounce-count', 0); // Initialize bounce count to 0
        let randomLeft = Math.random() * (maxWidth - circleElement.clientWidth);
        if (randomLeft < circleElement.clientWidth + 10) {
            randomLeft += 10;
        } else if (randomLeft > maxWidth - 10) {
            randomLeft -= 10;
        }
        const randomTop = Math.random() * (maxHeight - circleElement.clientHeight);

        circleElement.style.left = randomLeft + 'px';
        circleElement.style.top = randomTop + 'px';
        document.getElementById("container").appendChild(circleElement);
        circles.push(circleElement);
    }
}

// Function to apply gravity to a single circle element
function applyGravity(circleElement) {
    const container = document.getElementById('container');
    const customGravity = 9.8; // Adjust this value for gravity acceleration

    // Get the current velocity of the circle
    let circleVelocity = parseFloat(circleElement.getAttribute('data-velocity')) || 0;

    // Track the number of bounces
    let bounceCount = parseInt(circleElement.getAttribute('data-bounce-count')) || 0;

    // Adjust the velocity using gravity
    const elapsed = frameDelay / 1000;
    const acceleration = customGravity / pixelsPerMeter;
    circleVelocity += acceleration * elapsed / 500;

    const maxHeight = container.clientHeight - circleElement.clientHeight;
    const currentTop = parseFloat(circleElement.style.top) || 0;
    const potentialTop = currentTop + circleVelocity;

    // Check for collision with the bottom of the container
    if (potentialTop > maxHeight) {
        circleVelocity = -circleVelocity * coefficientOfRestitution; // Bounce with opposite velocity
        circleVelocity *= energyLossFactor; // Reduce energy

        // Ensure the circle doesn't go below the container
        circleElement.style.top = Math.min(maxHeight, potentialTop) + 'px';

        bounceCount++;

        // Gradually reduce energy until velocity is very low and bounce count is reached
        if (Math.abs(circleVelocity) < 10 && bounceCount >= 10) {
            circleVelocity = 0; // Stop when velocity is very low and bounce count is reached
        }
    } else if (potentialTop < 0) { // Check for collision with the top
        circleVelocity = -circleVelocity * coefficientOfRestitution; // Bounce with opposite velocity
        circleVelocity *= energyLossFactor; // Reduce energy

        // Ensure the circle doesn't go above the container
        circleElement.style.top = Math.max(0, potentialTop) + 'px';

        bounceCount++;

        // Gradually reduce energy until velocity is very low and bounce count is reached
        if (Math.abs(circleVelocity) < 10 && bounceCount >= 50) {
            circleVelocity = 0; // Stop when velocity is very low and bounce count is reached
        }
    } else {
        circleElement.style.top = potentialTop + 'px';
    }

    // Update the circle's velocity and bounce count attributes
    circleElement.setAttribute('data-velocity', circleVelocity);
    circleElement.setAttribute('data-bounce-count', bounceCount);
}

// Redraw the screen (implement your redraw logic)
function redrawScreen() {
    // Ensure that the circles are on the screen before updating their positions
    if (!areCirclesOnScreen) {
        return;
    }

    // Instead of moving the circles, call the checkGravity function for each circle
    for (let i = 0; i < numCircles; i++) {
        applyGravity(circles[i], i);
    }

    // Update the FPS display
    updateFPS();
}

// Function to update the FPS display
function updateFPS() {
    frameCount++;

    // Get the current timestamp
    const now = performance.now();

    if (now - lastSecond >= 1000) {
        // If 1 second has passed, update the FPS
        const fps = frameCount;
        const fpsElement = document.querySelector('.framesCounter');
        fpsElement.textContent = `FPS: ${fps}`;

        frameCount = 0;
        lastSecond = now; // Update the lastSecond timestamp
    }
}


