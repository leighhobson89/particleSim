import { createTitleScreen, toggleSound } from './ui.js';

function gameLoop() {
    // Update your game logic here

    updateClock();

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

createTitleScreen();

document.getElementById('option1').addEventListener('click', function() {
    // Remove all buttons from the screen
    const options = document.querySelector('.options');
    options.style.display = 'none';

    // Create a rectangle element
    const rectangle = document.createElement('div');
    rectangle.classList.add('rectangle');

    // Append the rectangle to the body
    document.body.appendChild(rectangle);

    // Create a circle element
    const circle = document.createElement('div');
    circle.classList.add('circle');

// Append the circle to the body
    document.body.appendChild(circle);

});

document.getElementById('option2').addEventListener('click', function() {
});
document.getElementById('option3').addEventListener('click', function() {
});
document.getElementById('option4').addEventListener('click', function() {
    toggleSound();
});

gameLoop();

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    const clockElement = document.querySelector('.clock');
    clockElement.textContent = timeString;
}
