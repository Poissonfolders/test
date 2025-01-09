// Références aux éléments vidéo
const videoStart = document.getElementById('videoStart');
const videoLoop = document.getElementById('videoLoop');
const videoChoice = document.getElementById('videoChoice');
const videoPixel = document.getElementById('videoPixel');

// Gestion de l'orientation mobile
const orientationMessage = document.getElementById('orientationMessage');
const container = document.querySelector('.container');

function handleOrientationChange() {
    // Vérifie si c'est un appareil mobile
    if (window.matchMedia("(max-width: 768px)").matches) {
        // Vérifie l'orientation
        if (window.matchMedia("(orientation: portrait)").matches) {
            orientationMessage.style.display = 'flex';
            container.classList.add('portrait-mode');
        } else {
            orientationMessage.style.display = 'none';
            container.classList.remove('portrait-mode');
        }
    } else {
        // Sur desktop, on cache toujours le message
        orientationMessage.style.display = 'none';
        container.classList.remove('portrait-mode');
    }
}

// Événements d'orientation
window.addEventListener('load', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);
window.addEventListener('orientationchange', () => {
    // Petit délai pour laisser le temps au navigateur de mettre à jour les dimensions
    setTimeout(handleOrientationChange, 100);
});

// 1) À la fin de Start.mp4, on affiche Fire.mp4 (loop)
videoStart.addEventListener('ended', () => {
    videoStart.style.display = 'none';
    videoLoop.style.display = 'block';
    videoLoop.play();
});

// 2) À la fin de Choice.mp4, on passe à Pixel.mp4 en loop + texte final
videoChoice.addEventListener('ended', () => {
    videoChoice.style.display = 'none';
    videoPixel.style.display = 'block';
    videoPixel.play();
    showFinalDialog();
});

const cross = document.querySelector('.cross');
const terminalDialog = document.getElementById('terminalDialog');
const codeLines = document.getElementById('codeLines');
const cursor = document.getElementById('cursor');
const kallimaDialog = document.getElementById('kallimaDialog');
const userInput = document.getElementById('userInput');
const alternateRefreshBtn = document.getElementById('alternateRefreshBtn');

let isKallimaSpeaking = false;

const fakeCodes = [
    "$ initiate_sequence.sh --force",
    "Loading kernel modules... [OK]",
    "Checking system integrity... [DONE]",
    "Mounting virtual filesystems... [SUCCESS]",
    "Starting background processes... [COMPLETE]"
];

let dialogIndex = 0;
const kallimaResponses = [
    "Kallima : I understand, it's a reasonable choice, but not the one I prefer. I'm sure the options given match what you desire.",
    "Kallima : I read you, perhaps, but I wanted to give the illusion of a perfect world, a comfortable place. Isn't it the case?",
    "Kallima : All the choices lead to saving this tree, or is it an unpleasant reality? Who would want to see a tree on fire?",
    "Kallima : Thinking of freedom shaped by an interface created without your participation is a very naive idea ;)",
    "Kallima : I give in to your desires. I understand your wish to truly comprehend what is happening to this tree. Perhaps by truly talking, we could find a better solution..."
];

cross.addEventListener('click', () => {
    document.querySelectorAll('video, #terminal, #finalDialog').forEach(el => {
        el.style.display = 'none';
    });

    terminalDialog.classList.remove('hidden');
    typeCodeLines(0);
});

function typeCodeLines(index) {
    if (index >= fakeCodes.length) {
        blinkCursor();
        return;
    }

    const line = fakeCodes[index];
    let charIndex = 0;

    function typeLine() {
        if (charIndex < line.length) {
            codeLines.innerHTML += line[charIndex];
            charIndex++;
            setTimeout(typeLine, 50);
        } else {
            codeLines.innerHTML += '<br>';
            setTimeout(() => typeCodeLines(index + 1), 200);
        }
    }

    typeLine();
}

function blinkCursor() {
    cursor.classList.remove('hidden');
    let blinkCount = 0;

    const blinkInterval = setInterval(() => {
        blinkCount++;
        if (blinkCount >= 6) {
            clearInterval(blinkInterval);
            cursor.classList.add('hidden');
            showKallimaQuestion();
        }
    }, 500);
}

function showKallimaQuestion() {
    typeKallimaText("Kallima : Congratulations! So, what option do you personally choose?", () => {
        userInput.classList.remove('hidden');
        userInput.focus();
    });
}

function typeKallimaText(text, callback) {
    isKallimaSpeaking = true;
    let charIndex = 0;
    kallimaDialog.textContent = '';

    function type() {
        if (charIndex < text.length) {
            kallimaDialog.textContent += text[charIndex];
            charIndex++;
            setTimeout(type, 50);
        } else {
            isKallimaSpeaking = false;
            if (callback) {
                callback();
            }
        }
    }

    type();
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && userInput.value.trim() !== '' && !isKallimaSpeaking) {
        const userMessage = userInput.value.trim();
        userInput.value = '';
        userInput.disabled = true;

        const response = kallimaResponses[dialogIndex];

        typeKallimaText(response, () => {
            dialogIndex++;
            userInput.disabled = false;

            if (dialogIndex === 1 || dialogIndex === 3) {
                kallimaDialog.innerHTML += '<br><br>';
                const refreshButton = document.getElementById('refreshBtn').cloneNode(true);
                refreshButton.classList.remove('hidden');
                kallimaDialog.appendChild(refreshButton);
                refreshButton.addEventListener('click', () => window.location.reload());
            }

            if (dialogIndex < kallimaResponses.length) {
                userInput.focus();
            }
            else if (dialogIndex === kallimaResponses.length) {
                kallimaDialog.innerHTML += '<br><br>';
                alternateRefreshBtn.classList.remove('hidden');
                alternateRefreshBtn.addEventListener('click', () => window.location.reload());
                userInput.disabled = true;
            }
        });
    }
});

const terminal = document.getElementById('terminal');
const peacefulIntro = document.getElementById('peacefulIntro');
const choices = document.getElementById('choices');

const dynamicText = document.createElement('p');
dynamicText.id = "dynamicText";
dynamicText.textContent = "";
terminal.insertBefore(dynamicText, peacefulIntro);

const texts = [
    {
        content: "How to transcend the simulation of interaction?",
        speed: 5,
        erase: true
    },
    {
        content: "A tree is on fire, revealing a presence",
        speed: 100,
        erase: true
    }
];

setTimeout(() => {
    showTerminal();
    // Afficher la croix en même temps
    cross.classList.remove("hidden");
    // Petit délai pour l'animation de fondu
    setTimeout(() => {
        cross.classList.add("fade-in");
    }, 100);
}, 5000);

function showTerminal() {
    terminal.classList.remove("hidden");
    terminal.style.opacity = 1;
    typeText(0);
}

function typeText(index) {
    if (index >= texts.length) {
        showPeacefulIntro();
        return;
    }

    const { content, speed, erase } = texts[index];
    let charIndex = 0;

    dynamicText.textContent = "";

    function type() {
        if (charIndex < content.length) {
            dynamicText.textContent = content.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, speed);
        } else if (erase) {
            setTimeout(() => eraseText(content, index), 500);
        } else {
            setTimeout(() => typeText(index + 1), 500);
        }
    }

    type();
}

function eraseText(content, index) {
    let charIndex = content.length;

    function erase() {
        if (charIndex > 0) {
            dynamicText.textContent = content.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 20);
        } else {
            dynamicText.textContent = "";
            typeText(index + 1);
        }
    }

    erase();
}

function showPeacefulIntro() {
    peacefulIntro.classList.remove("hidden");
    peacefulIntro.style.opacity = 1;
    showChoices();
}

function showChoices() {
    choices.classList.remove("hidden");
    const choiceElements = choices.querySelectorAll("p");
    choiceElements.forEach((choice, i) => {
        setTimeout(() => {
            choice.style.opacity = 1;
            choice.style.transform = "translateY(0)";
        }, 500 * i);
    });
}

choices.querySelectorAll('p').forEach((p) => {
    p.addEventListener('click', () => {
        videoLoop.style.display = 'none';
        terminal.style.display = 'none';
        videoChoice.style.display = 'block';
        videoChoice.play();
    });
});

const finalDialog = document.getElementById('finalDialog');
const finalText1 = document.getElementById('finalText1');
const finalText2 = document.getElementById('finalText2');
const refreshBtn = document.getElementById('refreshBtn');

const finalTexts = [
    { content: "Everything is perfect again.", speed: 50 },
    { content: "You doubt it? You can start all over if you want, after all, you are free to do anything.", speed: 50 }
];

function showFinalDialog() {
    finalDialog.classList.remove("hidden");
    finalDialog.style.opacity = 1;
    typeFinalTexts(0);
}

function typeFinalTexts(index) {
    if (index >= finalTexts.length) {
        refreshBtn.classList.remove("hidden");
        return;
    }
    const { content, speed } = finalTexts[index];
    let charIndex = 0;

    const targetParagraph = (index === 0) ? finalText1 : finalText2;
    targetParagraph.textContent = "";

    function type() {
        if (charIndex < content.length) {
            targetParagraph.textContent += content[charIndex];
            charIndex++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => typeFinalTexts(index + 1), 600);
        }
    }
    type();
}

refreshBtn.addEventListener('click', () => {
    window.location.reload();
});