// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    80, // Extreme wide-angle FOV for dramatic perspective distortion
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // Transparent background
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Position camera
camera.position.z = 5;

// Image URLs for the 10 faces (add your image paths here)
const faceImages = [
    'tex/mik.png',  // Face 0
    'tex/sarah.png',  // Face 1
    'tex/josh.png',  // Face 2
    'tex/tori.png',  // Face 3
    'tex/megan.png',  // Face 4
    'tex/joi.png',  // Face 5
    'tex/oliver.png',  // Face 6
    'tex/webb.png',  // Face 7
    'tex/nat.png',  // Face 8
    'tex/nick.png', // Face 9
];

// Create 10 individual planes arranged in a circle
// Each face should be 1x2 (width 1, height 2)
const faceWidth = 1;
const faceHeight = 2;
const numFaces = 10;

// Calculate radius so faces form a circle
// Circumference = numFaces * faceWidth = 10
// 2πr = 10, therefore r = 5/π
const radius = 4.84 / Math.PI; // ≈ 1.592

// Create shared texture loader
const textureLoader = new THREE.TextureLoader();

// Function to create a single slot machine cylinder
function createSlotMachine(positionX) {
    const slotMachineGroup = new THREE.Group();
    slotMachineGroup.position.x = positionX; // Position along X axis
    
    // Load textures and create planes using custom geometry
    faceImages.forEach((imageUrl, index) => {
    // Calculate angle for this face (distribute evenly around circle)
    const angle = (index / numFaces) * Math.PI * 2;
    
    // Create custom geometry for this face
    // We'll create a quad positioned correctly in 3D space
    const geometry = new THREE.BufferGeometry();
    
    // Calculate the four corners of the face
    // Face is positioned at radius distance from center, with width faceWidth and height faceHeight
    const halfWidth = faceWidth / 2;
    const halfHeight = faceHeight / 2;
    
    // Calculate the direction vector (outward normal)
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);
    
    // Calculate perpendicular vectors for the face edges
    const perpX = -Math.sin(angle);
    const perpZ = Math.cos(angle);
    
    // Create vertices for the quad
    // Top-left, top-right, bottom-left, bottom-right
    const vertices = new Float32Array([
        // Top-left
        radius * dirX + halfWidth * perpX,  halfHeight,  radius * dirZ + halfWidth * perpZ,
        // Top-right
        radius * dirX - halfWidth * perpX,  halfHeight,  radius * dirZ - halfWidth * perpZ,
        // Bottom-left
        radius * dirX + halfWidth * perpX, -halfHeight, radius * dirZ + halfWidth * perpZ,
        // Bottom-right
        radius * dirX - halfWidth * perpX, -halfHeight, radius * dirZ - halfWidth * perpZ,
    ]);
    
    // Create indices for two triangles
    const indices = new Uint16Array([
        0, 1, 2,  // First triangle
        1, 3, 2   // Second triangle
    ]);
    
    // Create UV coordinates (flipped vertically)
    const uvs = new Float32Array([
        0, 0,  // Top-left (flipped)
        1, 0,  // Top-right (flipped)
        0, 1,  // Bottom-left (flipped)
        1, 1   // Bottom-right (flipped)
    ]);
    
    // Set geometry attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    
    // Compute normals (pointing outward)
    geometry.computeVertexNormals();
    
    // Load texture
    const texture = textureLoader.load(
        imageUrl,
        // onLoad callback
        () => {
            console.log(`Loaded texture ${index + 1}: ${imageUrl}`);
        },
        // onProgress callback
        undefined,
        // onError callback
        (error) => {
            console.error(`Error loading texture ${index + 1}: ${imageUrl}`, error);
        }
    );
    
    // Rotate the texture 90 degrees
    texture.rotation = Math.PI / 2;
    texture.center.set(0.5, 0.5);
    // Flip the texture vertically
    texture.flipY = false;
    // Set color space to sRGB for proper color rendering
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Create material with texture
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        color: 0xffffff // Ensure full brightness
    });
    
    // Create the mesh
    const plane = new THREE.Mesh(geometry, material);
    
    // Store base angle for reference (for slider control)
    plane.userData.baseAngle = angle;
    plane.userData.index = index;
    
        // Add plane to the group
        slotMachineGroup.add(plane);
    });
    
    // Rotate the entire group 90 degrees on Z axis (to make it horizontal)
    slotMachineGroup.rotation.z = Math.PI / 2;
    // Randomly pick a starting face position (multiples of 36 + 18)
    // There are 10 faces, so pick a random face from 0 to 9
    const randomFaceIndex = Math.floor(Math.random() * numFaces);
    const startingRotationDegrees = (randomFaceIndex * 36) + 18; // Multiple of 36 + 18
    const rotationOffset = (startingRotationDegrees * Math.PI) / 180; // Convert to radians
    slotMachineGroup.rotation.x = rotationOffset;
    scene.add(slotMachineGroup);
    
    // Store rotation offset and starting face on the group
    slotMachineGroup.userData.rotationOffset = rotationOffset;
    slotMachineGroup.userData.startingFaceIndex = randomFaceIndex;
    
    return slotMachineGroup;
}

// Create 3 slot machines, positioned side by side
const numCylinders = 3;
const cylinderSpacing = 2; // No spacing between cylinders
const slotMachines = [];

for (let i = 0; i < numCylinders; i++) {
    const positionX = (i - (numCylinders - 1) / 2) * cylinderSpacing; // Center them
    const slotMachine = createSlotMachine(positionX);
    slotMachines.push(slotMachine);
}

// Output starting faces
console.log(`Starting faces: ${slotMachines.map((sm, i) => `Cylinder ${i + 1}: face ${sm.userData.startingFaceIndex}`).join(', ')}`);

// Spin animation variables
let isSpinning = false;
const spinStates = []; // Array to track each cylinder's spin state
const spinDuration = 3000; // 3 seconds
const minRotationDegrees = 360;
const maxRotationDegrees = 1440;

// Initialize spin states for each cylinder
slotMachines.forEach(() => {
    spinStates.push({
        isSpinning: false,
        spinStartTime: 0,
        spinStartRotation: 0,
        spinTotalRotation: 0,
        spinTotalRotationDegrees: 0
    });
});

// Cubic-bezier easing function
// cubic-bezier(0.25, 0, 0, 1)
function cubicBezier(x) {
    // Cubic-bezier control points: (0.25, 0, 0, 1)
    const x1 = 0.25, y1 = 0;
    const x2 = 0, y2 = 1.05;
    
    // Binary search to find t that gives us the desired x
    let t = 0.5;
    let minT = 0;
    let maxT = 1;
    
    // Iterate to find t (binary search with tolerance)
    for (let i = 0; i < 20; i++) {
        // Calculate x(t) using cubic bezier formula
        const x_t = 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3);
        
        if (Math.abs(x_t - x) < 0.0001) break;
        
        if (x_t < x) {
            minT = t;
            t = (t + maxT) / 2;
        } else {
            maxT = t;
            t = (minT + t) / 2;
        }
    }
    
    // Calculate y(t) using the found t
    const y = 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3);
    
    return y;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Handle spin animation for all cylinders
    slotMachines.forEach((slotMachine, index) => {
        const state = spinStates[index];
        if (state.isSpinning) {
            const elapsed = Date.now() - state.spinStartTime;
            
            // Don't animate if we haven't reached the start time yet (for delayed starts)
            if (elapsed < 0) {
                return;
            }
            
            const progress = Math.min(elapsed / spinDuration, 1);
            const easedProgress = cubicBezier(progress);
            
            // Apply rotation starting from current position, with offset
            const rotationOffset = slotMachine.userData.rotationOffset;
            slotMachine.rotation.x = rotationOffset + state.spinStartRotation + (easedProgress * state.spinTotalRotation);
            
            // Stop spinning when complete
            if (progress >= 1) {
                state.isSpinning = false;
            }
        }
    });
    
    // Check if any cylinder is spinning
    const anySpinning = spinStates.some(state => state.isSpinning);
    const allFinished = !anySpinning;
    
    // Update display based on animation state
    if (anySpinning) {
        // Show "Rolling..." while any cylinder is spinning
        if (matchesDisplay.textContent !== 'Spinning...') {
            wrapTextInSpans('Spinning...');
        }
    } else if (pendingMatches !== undefined) {
        // Update the display with the matches count when all finished
        let matchText;
        if (pendingMatches === 1) {
            matchText = 'No matches :(';
            jackpotDisplay.style.display = 'none';
        } else if (pendingMatches === 2) {
            matchText = 'Almost...';
            jackpotDisplay.style.display = 'none';
        } else if (pendingMatches === 3) {
            matchText = 'HOLY SHIT!!!!!';
            jackpotDisplay.style.display = 'block';
            // Change background to win.gif when jackpot is hit
            document.body.style.backgroundImage = "url('tex/win.gif')";
        } else {
            matchText = `${pendingMatches} matches`;
            jackpotDisplay.style.display = 'none';
        }
        wrapTextInSpans(matchText);
        pendingMatches = undefined; // Clear the pending value
    }
    
    // Animate each character with sine wave (floating up and down with offset)
    const floatSpeed = 0.002; // Speed of the float animation
    const floatAmount = 10; // Pixels to float up/down
    const charOffset = 0.1; // Delay between each character
    const spans = matchesDisplay.querySelectorAll('span');
    
    spans.forEach((span, index) => {
        const timeOffset = index * charOffset;
        const floatOffset = Math.sin((Date.now() * floatSpeed) + timeOffset) * floatAmount;
        span.style.transform = `translateY(${floatOffset}px)`;
    });
    
    // Keep the container centered
    matchesDisplay.style.transform = 'translateX(-50%)';
    
    // Update spin counter display (for countdown timer)
    updateSpinCounterDisplay();
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Get matches display element
const matchesDisplay = document.getElementById('matches-display');
const jackpotDisplay = document.getElementById('jackpot-display');
const spinCounter = document.getElementById('spin-counter');

// Variable to store pending matches count (updated when animation completes)
let pendingMatches;

// Daily spin limit management
const MAX_SPINS_PER_DAY = 20;
const SPIN_STORAGE_KEY = 'slotMachineSpins';
const DATE_STORAGE_KEY = 'slotMachineDate';

function getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

function getSpinsRemaining() {
    const today = getTodayDateString();
    const storedDate = localStorage.getItem(DATE_STORAGE_KEY);
    const storedSpins = localStorage.getItem(SPIN_STORAGE_KEY);
    
    // If it's a new day, reset spins
    if (storedDate !== today) {
        localStorage.setItem(DATE_STORAGE_KEY, today);
        localStorage.setItem(SPIN_STORAGE_KEY, MAX_SPINS_PER_DAY.toString());
        return MAX_SPINS_PER_DAY;
    }
    
    // Return remaining spins for today
    return storedSpins ? parseInt(storedSpins, 10) : MAX_SPINS_PER_DAY;
}

function useSpin() {
    const remaining = getSpinsRemaining();
    if (remaining > 0) {
        const today = getTodayDateString();
        localStorage.setItem(DATE_STORAGE_KEY, today);
        localStorage.setItem(SPIN_STORAGE_KEY, (remaining - 1).toString());
        return true;
    }
    return false;
}

function getTimeUntilNextDay() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
}

function updateSpinCounterDisplay() {
    const remaining = getSpinsRemaining();
    
    if (remaining > 0) {
        spinCounter.textContent = `Spins remaining: ${remaining}/${MAX_SPINS_PER_DAY}`;
    } else {
        const time = getTimeUntilNextDay();
        spinCounter.textContent = `Out of spins! Next spin available in ${time.hours}h ${time.minutes}m ${time.seconds}s`;
    }
}

function resetSpinCounter() {
    const today = getTodayDateString();
    localStorage.setItem(DATE_STORAGE_KEY, today);
    localStorage.setItem(SPIN_STORAGE_KEY, MAX_SPINS_PER_DAY.toString());
    updateSpinCounterDisplay();
    console.log('Spin counter reset!');
}

// Function to wrap text in spans for per-character animation
function wrapTextInSpans(text) {
    matchesDisplay.innerHTML = '';
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        matchesDisplay.appendChild(span);
    });
}

// Initialize text with spans
wrapTextInSpans('Click to spin');

// Initialize spin counter display
updateSpinCounterDisplay();

// Update spin counter every second (for countdown)
setInterval(updateSpinCounterDisplay, 1000);

// Track if 7 key is being held down (for debug mode)
let isSevenKeyPressed = false;

// Track 7 key state
window.addEventListener('keydown', (event) => {
    if (event.key === '7' || event.keyCode === 55) {
        isSevenKeyPressed = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === '7' || event.keyCode === 55) {
        isSevenKeyPressed = false;
    }
});

// Start animation
animate();

// Click to spin all cylinders
renderer.domElement.addEventListener('click', (event) => {
    // Check if any cylinder is still spinning
    const anySpinning = spinStates.some(state => state.isSpinning);
    if (anySpinning) return;
    
    // 7 key + click: resets spin counter and forces jackpot (debug mode)
    const forceJackpot = isSevenKeyPressed;
    if (forceJackpot) {
        resetSpinCounter();
    }
    
    // Check if user has spins remaining (skip check for 7 key debug mode)
    if (!forceJackpot) {
        const remaining = getSpinsRemaining();
        if (remaining <= 0) {
            // Out of spins, don't allow spin
            return;
        }
    }
    
    // Hide jackpot display when starting a new spin
    jackpotDisplay.style.display = 'none';
    // Reset background to original when starting a new spin
    document.body.style.backgroundImage = "url('tex/bg.jpg')";
    
    // Use a spin (unless in debug mode)
    if (!forceJackpot) {
        useSpin();
        updateSpinCounterDisplay();
    }
    const targetFace = forceJackpot ? 0 : null; // Force all to land on face 0 for jackpot
    
    const landingFaces = [];
    
    // Start spinning all cylinders with offset delays
    // Leftmost (index 0) starts first, then middle (index 1), then rightmost (index 2)
    const baseStartTime = Date.now();
    slotMachines.forEach((slotMachine, index) => {
        const state = spinStates[index];
        
        // Offset delays: leftmost (0) = 0s, middle (1) = 0.2s, rightmost (2) = 0.4s
        const delay = index * 0.1; // Each cylinder starts 0.2s after the previous
        
        state.isSpinning = true;
        state.spinStartTime = baseStartTime + (delay * 1000); // Convert seconds to milliseconds
        
        const rotationOffset = slotMachine.userData.rotationOffset;
        state.spinStartRotation = slotMachine.rotation.x - rotationOffset;
        
        let landingFaceIndex;
        
        if (forceJackpot && targetFace !== null) {
            // Force all cylinders to land on the same face for jackpot testing
            // Calculate the rotation needed to land on targetFace
            const currentRotationDegrees = (slotMachine.rotation.x * 180) / Math.PI;
            // Target position is at (targetFace * 36) + 18 degrees
            const targetRotationDegrees = (targetFace * 36) + 18;
            // Calculate the difference, ensuring we spin at least one full rotation
            let rotationDiff = targetRotationDegrees - currentRotationDegrees;
            // Normalize to positive and add at least 360 degrees
            while (rotationDiff < 360) {
                rotationDiff += 360;
            }
            // Round to nearest multiple of 36
            const steps = Math.ceil(rotationDiff / 36);
            const finalRotationDegrees = steps * 36;
            
            state.spinTotalRotationDegrees = finalRotationDegrees;
            state.spinTotalRotation = (finalRotationDegrees * Math.PI) / 180;
            landingFaceIndex = targetFace;
        } else {
            // Normal random behavior
            // Generate random rotation between 36 and 1440 degrees, always divisible by 36
            // Calculate range in terms of 36-degree steps
            const minSteps = minRotationDegrees / 36; // 1 step
            const maxSteps = maxRotationDegrees / 36; // 40 steps
            // Generate random integer number of steps
            const randomSteps = Math.floor(Math.random() * (maxSteps - minSteps + 1)) + minSteps;
            // Convert to degrees (always divisible by 36) and then to radians
            const randomDegrees = randomSteps * 36;
            state.spinTotalRotationDegrees = randomDegrees;
            state.spinTotalRotation = (randomDegrees * Math.PI) / 180;
            
            // Calculate which face it will land on (before animation)
            // Current absolute rotation in degrees
            const currentRotationDegrees = (slotMachine.rotation.x * 180) / Math.PI;
            // Final rotation will be current + spin amount
            const finalRotationDegrees = currentRotationDegrees + state.spinTotalRotationDegrees;
            // Account for the 18-degree offset and determine face index
            // Each face is 36 degrees, positions are at multiples of 36 + 18
            // Subtract 18 to align with face boundaries, then divide by 36
            const facePosition = (finalRotationDegrees - 18) / 36;
            // Use modulo 10 to wrap around and get face index (0-9)
            let faceIndex = Math.round(facePosition) % 10;
            // Handle negative modulo
            landingFaceIndex = faceIndex < 0 ? faceIndex + 10 : faceIndex;
        }
        
        landingFaces.push(landingFaceIndex);
    });
    
    // Count matching faces
    const faceCounts = {};
    landingFaces.forEach(face => {
        faceCounts[face] = (faceCounts[face] || 0) + 1;
    });
    
    // Find the maximum number of matching faces
    const maxMatches = Math.max(...Object.values(faceCounts));
    
    // Store matches to display when animation completes
    pendingMatches = maxMatches;
    
    // Output number of matching faces
    if (forceJackpot) {
        console.log('DEBUG: Forced jackpot! (7 key + click)');
    }
    console.log(`${maxMatches} matching face${maxMatches > 1 ? 's' : ''}`);
});
