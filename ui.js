// ui.js

export const container = document.createElement('div');
export function createTitleScreen() {
    const titleScreen = document.createElement('div');
    titleScreen.classList.add('title-screen');

    const title = document.createElement('h1');
    title.textContent = 'Particle Simulator';
    title.classList.add('title');

    const options = document.createElement('div');
    options.classList.add('options');

    const inGameOptions = document.createElement('div');
    inGameOptions.classList.add('inGameOptions');

    // Define the option names and their initial colors
    const optionInfo = [
        { name: 'New Game', color: '#007bff' },    // Blue
        { name: 'Load Game', color: '#007bff' },   // Blue
        { name: 'Help', color: '#007bff' },        // Blue
        { name: 'Toggle Sound', color: '#00cc00' } // Green
    ];

    // Define the option names and their initial colors
    const inGameOptionInfo = [
        { name: 'Start Again', color: '#007bff' },
        { name: 'White Coloured Particles', color: '#007bff' },
        { name: 'Number Of Particles', color: '#007bff' },
        { name: 'Bounce Height', color: '#00cc00' }
    ];

    // Create and append clickable options
    for (let i = 0; i < optionInfo.length; i++) {
        const option = document.createElement('div');
        option.textContent = optionInfo[i].name;
        option.classList.add('option');
        option.style.backgroundColor = optionInfo[i].color;
        option.id = `option${i + 1}`;
        options.appendChild(option);
    }

    for (let i = 0; i < inGameOptionInfo.length; i++) {
        const inGameOption = document.createElement('div');
        inGameOption.textContent = inGameOptionInfo[i].name;
        inGameOption.classList.add('inGameOption');
        inGameOption.style.backgroundColor = inGameOptionInfo[i].color;
        inGameOption.id = `inGameOption${i + 1}`;
        inGameOptions.appendChild(inGameOption);
    }

    titleScreen.appendChild(title);
    titleScreen.appendChild(options);
    titleScreen.appendChild(inGameOptions);
    // inGameOptions.style.display = 'none';

    // Append the title screen to the body
    document.body.appendChild(titleScreen);

    container.classList.add('container');
    container.id = 'container';
    document.body.appendChild(container);
}

export function toggleSound() {
    const soundOption = document.getElementById('option4');
    const isSoundOn = soundOption.style.backgroundColor === 'rgb(255, 0, 0)'; // Red color

    if (isSoundOn) {
        soundOption.style.backgroundColor = '#00cc00'; // Green
        console.log('Sound turned on');
        // Call your "toggleSound(on)" function here
    } else {
        soundOption.style.backgroundColor = 'rgb(255, 0, 0)'; // Red
        console.log('Sound turned off');
        // Call your "toggleSound(off)" function here
    }
}

export function getContainerWidth() {
    return container.clientWidth;
}

export function getContainerHeight() {
    return container.clientHeight;
}


