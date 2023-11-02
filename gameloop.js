import {createTitleScreen, toggleSound, getContainerWidth, getContainerHeight, container} from './ui.js';

// Define frame rate (60 FPS)
const targetFrameRate = 60;
const frameDelay = 1000 / targetFrameRate;

const BOUNCES_BEFORE_STOP = 100;

// Adjust pixelsPerMeter based on frame rate and gravity
const gravity = 9.8; // m/s^2
const pixelsPerMeter = (frameDelay / 1000) * targetFrameRate / (gravity * 100);


let frameCount = 0;
let lastSecond = performance.now();
let lastFrameTime = performance.now();
let areCirclesOnScreen = false;

let circles = [];
const numCircles = 10; // Number of circles to create
const coefficientOfRestitution = 0.7; // Adjust as needed
const energyLossFactor = 0.9; // Adjust to control energy loss (should be less than 1)

function gameLoop() {
    const now = performance.now();
    const elapsed = now - lastFrameTime;

    if (elapsed >= frameDelay) {
        lastFrameTime = now;

        // Apply gravity and check collisions for each circle
        for (let i = 0; i < numCircles; i++) {
            const circleElement = circles[i];

            // Apply gravity to the circle
            let bounceCount = applyGravity(circleElement);
            if (bounceCount < BOUNCES_BEFORE_STOP) {
                applyLateralMotion(circleElement, bounceCount);
            }

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
    const inGameOptions = document.querySelector('.inGameOptions');
    options.style.display = 'none';
    inGameOptions.style.display = 'flex';
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

function checkCollision(circleElement) {
    const container = document.getElementById('container');
    const containerRect = container.getBoundingClientRect();
    const circleRect = circleElement.getBoundingClientRect();

    const collisionTop = circleRect.top <= containerRect.top;
    const collisionBottom = circleRect.bottom >= containerRect.bottom + 4;
    const collisionLeft = circleRect.left <= containerRect.left + 5;
    const collisionRight = circleRect.right >= containerRect.right -5;

    if (collisionTop || collisionBottom) {
        // Handle collision with top and bottom edges
        let circleVelocity = parseFloat(circleElement.getAttribute('data-velocity'));
        circleVelocity = -circleVelocity * coefficientOfRestitution;
        circleVelocity *= energyLossFactor;

        circleElement.setAttribute('data-velocity', circleVelocity);
    }

    if (collisionLeft || collisionRight) {
        // Handle collision with left and right edges
        let circleLateralVelocity = parseFloat(circleElement.getAttribute('data-lateral-velocity'));
        circleLateralVelocity = -circleLateralVelocity; // Reverse the lateral velocity
        // circleLateralVelocity *= energyLossFactor;
        circleElement.setAttribute('data-lateral-velocity', circleLateralVelocity);
    }

    return collisionTop || collisionBottom || collisionLeft || collisionRight;
}


function createCircles(maxWidth, maxHeight) {
    for (let i = 0; i < numCircles; i++) {
        const circleElement = document.createElement('div');
        circleElement.classList.add('circle');
        circleElement.style.backgroundColor = getRandomRGBColor(); // Set random background color

        const initialLateralVelocity = (Math.random() - 0.5) * 40; // Adjust the range as needed
        // const initialLateralVelocity = Math.random() * 20; // You can adjust the magnitude of the lateral force
        circleElement.setAttribute('data-lateral-velocity', initialLateralVelocity.toString()); // Convert to string

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

// Function to apply lateral motion to a single circle element
function applyLateralMotion(circleElement, bounceCount) {

    const container = document.getElementById('container');
    const containerRect = container.getBoundingClientRect();
    const circleRect = circleElement.getBoundingClientRect();

    const lateralVelocity = parseFloat(circleElement.getAttribute('data-lateral-velocity'));

    // Get the current horizontal position of the circle
    const currentLeft = parseFloat(circleElement.style.left);

    // Calculate the potential new horizontal position based on the lateral velocity
    const potentialLeft = currentLeft + lateralVelocity;

    // Update the circle's horizontal position
    circleElement.style.left = potentialLeft + 'px';

    if ((circleRect.left <= containerRect.left - 4 || circleRect.right >= containerRect.right + 4) && bounceCount >= BOUNCES_BEFORE_STOP) {
        circleElement.setAttribute('data-lateral-velocity', 0);
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
        if (Math.abs(circleVelocity) < 10 && bounceCount >= BOUNCES_BEFORE_STOP) {
            circleVelocity = 0; // Stop when velocity is very low and bounce count is reached
        }
    } else if (potentialTop < 0) { // Check for collision with the top
        circleVelocity = -circleVelocity * coefficientOfRestitution; // Bounce with opposite velocity
        circleVelocity *= (energyLossFactor); // Reduce energy

        // Ensure the circle doesn't go above the container
        circleElement.style.top = Math.max(0, potentialTop) + 'px';

        bounceCount++;

        // Gradually reduce energy until velocity is very low and bounce count is reached
        if (Math.abs(circleVelocity) < 10 && bounceCount >= BOUNCES_BEFORE_STOP) {
            circleVelocity = 0; // Stop when velocity is very low and bounce count is reached
        }
    } else {
        circleElement.style.top = potentialTop + 'px';
    }

    // Update the circle's velocity and bounce count attributes
    circleElement.setAttribute('data-velocity', circleVelocity);
    circleElement.setAttribute('data-bounce-count', bounceCount);

    return bounceCount;
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

function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}