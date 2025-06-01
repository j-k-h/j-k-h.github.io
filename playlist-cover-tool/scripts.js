// ################## SET TEXT ##################

const showTextInput = document.getElementById('show-text');
const monthInput = document.getElementById('month-control');
const yearInput = document.getElementById('year-control');
const monthText = document.getElementById('month-text');
const yearText = document.getElementById('year-text');
const textColorInput = document.getElementById('text-color');
const textElement = document.getElementById('text');
const gradientStopsInput = document.getElementById('gradient-stops');
const gradientStopsDisplay = document.querySelector('#gradient-stops').previousElementSibling;
const randomComplexityInput = document.getElementById('random-complexity');
const element = document.querySelector('#artwork');

function updateTextVisibility() {
    document.getElementById('text').style.display = showTextInput.checked ? 'flex' : 'none';
}

// Add event listener to respond to checkbox changes
showTextInput.addEventListener('change', updateTextVisibility);

// Initial visibility state
updateTextVisibility();

function updateText() {
    monthText.textContent = monthInput.value || 'month';
    yearText.textContent = (yearInput.value || 'year').replace(/'/g, 'ʼ');
}

function updateTextColor() {
    textElement.style.color = textColorInput.value;
}

// Update gradient stops display
function updateGradientStopsDisplay() {
    gradientStopsDisplay.textContent = gradientStopsInput.value;
}

// Handle random complexity toggle
function handleRandomComplexity() {
    gradientStopsInput.disabled = randomComplexityInput.checked;
    if (!randomComplexityInput.checked) {
        updateGradientStopsDisplay();
    }
}

// Add event listeners
gradientStopsInput.addEventListener('input', () => {
    updateGradientStopsDisplay();
    if (!randomComplexityInput.checked) {
        generateRandomGradient();
    }
});
randomComplexityInput.addEventListener('change', handleRandomComplexity);

// Initial setup
handleRandomComplexity();

monthInput.addEventListener('input', updateText);
yearInput.addEventListener('input', updateText);
textColorInput.addEventListener('input', updateTextColor);

updateText();
updateTextColor();

// ################## GRADIENT GENERATION ##################

function generateRandomGradient() {
    // Add scale animation
    element.classList.add('scale');
    
    // Remove scale class after animation completes
    element.addEventListener('animationend', () => {
        element.classList.remove('scale');
    }, { once: true });
    
    // Get number of colors based on random complexity setting
    let numOfColors;
    if (randomComplexityInput.checked) {
        numOfColors = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
        gradientStopsDisplay.textContent = numOfColors;
        gradientStopsInput.value = numOfColors;
    } else {
        numOfColors = parseInt(gradientStopsInput.value);
    }
    
    // Generate colors
    const colors = Array.from({ length: numOfColors }, () => 
        '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    );
    
    // Generate random positions with minimum distance of 5 units
    const positions = [];
    const minDistance = 5;
    const maxAttempts = 100; // Prevent infinite loops
    
    for (let i = 0; i < numOfColors; i++) {
        let position;
        let attempts = 0;
        
        do {
            position = Math.random() * 100;
            attempts++;
        } while (
            attempts < maxAttempts && 
            positions.some(p => Math.abs(p - position) < minDistance)
        );
        
        positions.push(position);
    }
    
    // Sort the positions
    positions.sort((a, b) => a - b);
    
    // Create gradient stops with random positions
    const gradientStops = colors.map((color, index) => {
        return `${color} ${positions[index]}%`;
    });
    
    // Create the gradient
    const gradient = `radial-gradient(circle at 50% 50%, ${gradientStops.join(', ')})`;
    element.style.background = gradient;
}

// Initial gradient
generateRandomGradient();

// ################## SAVE IMAGE ##################

function saveArtworkAsImage() {
    const targetWidth = 3000; // desired width in pixels
    const element = document.querySelector("#artwork");
    const scale = targetWidth / element.offsetWidth;
    
    const options = {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
        logging: false
    };

    html2canvas(element, options).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png', 1.0);
        const month = monthInput.value || 'month';
        const year = yearInput.value || 'year';
        link.download = `playlist-${month}-${year}.png`;
        link.click();
    });
}

document.querySelector('#save-button').addEventListener('click', saveArtworkAsImage);
document.querySelector('#generate-gradient').addEventListener('click', generateRandomGradient);

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Ignore keyboard shortcuts when typing in inputs
    if (document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') return;
    
    // Handle different shortcuts
    switch (event.key.toLowerCase()) {
        case 'r':
            generateRandomGradient();
            break;
        case 's':
            saveArtworkAsImage();
            break;
    }
});
