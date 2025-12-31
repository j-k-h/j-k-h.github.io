// Get references to the timer elements
const repCountDisplay = document.querySelector('.rep-count-value-left');
const repCountDisplayLeft = document.querySelector('.rep-count-value-left');
const repCountDisplayRight = document.querySelector('.rep-count-value-right');
const tempoCountDisplay = document.querySelector('.tempo-count-value');
const timerDisplay = document.querySelector('.timer-text');
const timerContainer = document.querySelector('.timer');
const repProgressBar = document.querySelector('.rep-progress-bar-left');
const repProgressBarLeft = document.querySelector('.rep-progress-bar-left');
const repProgressBarRight = document.querySelector('.rep-progress-bar-right');
const tempoProgressBar = document.querySelector('.tempo-progress-bar');
const countdownInput = document.getElementById('countdown-input');
const alternatingCheckbox = document.getElementById('alternating-checkbox');
const alternatingLeftRadio = document.getElementById('alternating-left-radio');
const alternatingRightRadio = document.getElementById('alternating-right-radio');
const alternatingOptions = document.querySelector('.alternating-options');
const startStopButton = document.getElementById('start-stop-button');
const countsRow = document.querySelector('.counts-row');
const repCountLeftContainer = document.querySelector('.rep-count-left');
const repCountRightContainer = document.querySelector('.rep-count-right');
const repLeftLabel = repCountLeftContainer ? repCountLeftContainer.querySelector('.label') : null;
const repRightLabel = repCountRightContainer ? repCountRightContainer.querySelector('.label') : null;

let timerInterval = null;
let tempoInterval = null;
let countdownInterval = null;
let tempoCount = 0;
let repCount = 0;
let isRunning = false;
let isCountdown = false;
let isHoldPhase = false;
let cycleCount = 0;
let startTime = 0;
let repCycleStartTime = 0;
let tempoCycleStartTime = 0;
let isAlternating = false;
let isLeftSide = true;
let alternatingCycleCount = 0;
let repCountLeft = 1;
let repCountRight = 1;
let hasSwitchedOnce = false; // Track if we've completed at least one full cycle (Left -> Right -> Left)

// Function to trigger scale animation
function triggerScaleAnimation(element) {
    if (!element) return;
    
    // Remove animation class to reset
    element.classList.remove('animate');
    
    // Force reflow to ensure class removal is processed
    void element.offsetWidth;
    
    // Add animation class
    element.classList.add('animate');
    
    // Remove class after animation completes
    setTimeout(() => {
        element.classList.remove('animate');
    }, 150);
}

// Function to update alternating mode display
function updateAlternatingDisplay() {
    isAlternating = alternatingCheckbox ? alternatingCheckbox.checked : false;
    
    // Show/hide radio buttons based on alternating checkbox
    if (alternatingOptions) {
        alternatingOptions.style.display = isAlternating ? 'inline' : 'none';
    }
    
    if (countsRow) {
        if (isAlternating) {
            countsRow.classList.add('alternating');
            // Show both sides, but set opacity based on active side
            if (repCountLeftContainer) repCountLeftContainer.style.display = 'flex';
            if (repCountRightContainer) repCountRightContainer.style.display = 'flex';
            // Update labels
            if (repLeftLabel) repLeftLabel.textContent = 'Rep (Left)';
            if (repRightLabel) repRightLabel.textContent = 'Rep (Right)';
            updateAlternatingVisibility();
        } else {
            countsRow.classList.remove('alternating');
            if (repCountLeftContainer) {
                repCountLeftContainer.style.display = 'flex';
                repCountLeftContainer.classList.remove('active', 'inactive');
            }
            if (repCountRightContainer) {
                repCountRightContainer.style.display = 'none';
                repCountRightContainer.classList.remove('active', 'inactive');
            }
            if (repLeftLabel) repLeftLabel.textContent = 'Rep';
        }
    }
}

// Function to update which rep count is active/inactive in alternating mode
function updateAlternatingVisibility() {
    if (isAlternating) {
        // If timer is running, use current isLeftSide state; otherwise use radio button selection
        let activeSide;
        if (isRunning) {
            // During timer run, use the current alternating state
            activeSide = isLeftSide;
        } else {
            // Before starting, use radio button selection
            const leftSelected = alternatingLeftRadio ? alternatingLeftRadio.checked : false;
            const rightSelected = alternatingRightRadio ? alternatingRightRadio.checked : false;
            activeSide = rightSelected ? false : (leftSelected ? true : true);
        }
        
        if (activeSide) {
            // Left is active
            if (repCountLeftContainer) {
                repCountLeftContainer.classList.add('active');
                repCountLeftContainer.classList.remove('inactive');
            }
            if (repCountRightContainer) {
                repCountRightContainer.classList.add('inactive');
                repCountRightContainer.classList.remove('active');
            }
        } else {
            // Right is active
            if (repCountLeftContainer) {
                repCountLeftContainer.classList.add('inactive');
                repCountLeftContainer.classList.remove('active');
            }
            if (repCountRightContainer) {
                repCountRightContainer.classList.add('active');
                repCountRightContainer.classList.remove('inactive');
            }
        }
    }
}

// Function to format time as MM:SS:MS
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // Show centiseconds (00-99)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

// Function to update the timer display
function updateTimer() {
    if (timerDisplay && isRunning) {
        const elapsed = Date.now() - startTime;
        timerDisplay.textContent = formatTime(elapsed);
        
        // Update progress bars
        if (isAlternating) {
            // In alternating mode, rep count cycle is 8 seconds (2 tempo cycles) per side
            const repCycleDuration = 8000;
            const repElapsed = Date.now() - repCycleStartTime;
            const repProgress = Math.min((repElapsed / repCycleDuration) * 100, 100);
            // Update only the visible side's progress bar
            if (isLeftSide && repProgressBarLeft) {
                repProgressBarLeft.style.width = `${repProgress}%`;
            } else if (!isLeftSide && repProgressBarRight) {
                repProgressBarRight.style.width = `${repProgress}%`;
            }
        } else {
            // Normal mode: rep count cycle is 8 seconds (2 tempo cycles)
            if (repProgressBar) {
                const repElapsed = Date.now() - repCycleStartTime;
                const repProgress = Math.min((repElapsed / 8000) * 100, 100);
                repProgressBar.style.width = `${repProgress}%`;
            }
        }
        
        if (tempoProgressBar) {
            // Tempo count cycle is 4 seconds (1, 2, 3, Hold)
            const tempoElapsed = Date.now() - tempoCycleStartTime;
            const tempoProgress = Math.min((tempoElapsed / 4000) * 100, 100);
            tempoProgressBar.style.width = `${tempoProgress}%`;
        }
    }
}

// Function to update the tempo-count (called exactly every 1000ms)
function updateTempoCount() {
    if (isHoldPhase) {
        // After "Hold", check if we've completed 2 cycles
        cycleCount++;
        
        if (isAlternating) {
            // In alternating mode, show each side for 2 cycles, then switch
            alternatingCycleCount++;
            
            if (alternatingCycleCount === 2) {
                // After showing current side twice, switch to the other side
                // Toggle to the other side
                isLeftSide = !isLeftSide;
                alternatingCycleCount = 0;
                
                // Now that we're switching TO a side, increment it (but only after we've completed at least one full cycle
                if (hasSwitchedOnce) {
                    if (isLeftSide) {
                        // We're switching back to Left, increment Left
                        repCountLeft++;
                        if (repCountDisplayLeft) {
                            repCountDisplayLeft.textContent = repCountLeft;
                            triggerScaleAnimation(repCountDisplayLeft);
                        }
                    } else {
                        // We're switching back to Right, increment Right
                        repCountRight++;
                        if (repCountDisplayRight) {
                            repCountDisplayRight.textContent = repCountRight;
                            triggerScaleAnimation(repCountDisplayRight);
                        }
                    }
                } else {
                    // First time switching (from Left to Right), mark that we've switched once
                    hasSwitchedOnce = true;
                }
                
                updateAlternatingVisibility(); // Update which rep count is visible
                
                // Reset rep cycle timer when switching sides
                repCycleStartTime = Date.now();
                
                // Debug logging
                const elapsed = Date.now() - startTime;
                const timerValue = formatTime(elapsed);
                console.log('Rep count updated:', {
                    repCountLeft: repCountLeft,
                    repCountRight: repCountRight,
                    isLeftSide: isLeftSide,
                    tempoCount: tempoCount,
                    timerValue: timerValue
                });
            }
            
            // Update the visible rep count display
            if (isLeftSide && repCountDisplayLeft) {
                repCountDisplayLeft.textContent = repCountLeft;
            } else if (!isLeftSide && repCountDisplayRight) {
                repCountDisplayRight.textContent = repCountRight;
            }
        } else {
            // Normal mode: increment every 2 cycles
            if (cycleCount === 2) {
                // After 2 complete cycles, increment rep-count and reset
                repCount++;
                if (repCountDisplay) {
                    repCountDisplay.textContent = repCount;
                    triggerScaleAnimation(repCountDisplay); // Only animate when value changes
                }
                cycleCount = 0;
                repCycleStartTime = Date.now(); // Reset rep cycle timer
                
                // Debug logging
                const elapsed = Date.now() - startTime;
                const timerValue = formatTime(elapsed);
                console.log('Rep count updated:', {
                    repCount: repCount,
                    tempoCount: tempoCount,
                    timerValue: timerValue
                });
            } else {
                // Update display without animation when value hasn't changed
                if (repCountDisplay) {
                    repCountDisplay.textContent = repCount;
                }
            }
        }
        
        tempoCount = 1;
        tempoCountDisplay.textContent = tempoCount;
        triggerScaleAnimation(tempoCountDisplay);
        tempoCycleStartTime = Date.now(); // Reset tempo cycle timer
        isHoldPhase = false;
    } else if (tempoCount === 3) {
        // After tempo-count reaches 3, show "Hold"
        tempoCountDisplay.textContent = 'Hold';
        triggerScaleAnimation(tempoCountDisplay);
        isHoldPhase = true;
    } else {
        // Otherwise, just increment tempo-count
        tempoCount++;
        tempoCountDisplay.textContent = tempoCount;
        triggerScaleAnimation(tempoCountDisplay);
    }
}

// Function to start countdown
function startCountdown() {
    if (isRunning || isCountdown) return;
    updateButtonText();
    
    const countdownDuration = parseInt(countdownInput.value) || 3;
    const clampedDuration = Math.max(1, Math.min(10, countdownDuration));
    
    isCountdown = true;
    let remaining = clampedDuration;
    
    // Update display immediately
    if (timerDisplay) {
        timerDisplay.textContent = String(remaining);
        triggerScaleAnimation(timerDisplay);
    }
    
    countdownInterval = setInterval(() => {
        remaining--;
        
        if (remaining > 0) {
            if (timerDisplay) {
                timerDisplay.textContent = String(remaining);
                triggerScaleAnimation(timerDisplay);
            }
        } else {
            // Countdown finished, start the timer
            clearInterval(countdownInterval);
            countdownInterval = null;
            isCountdown = false;
            startTimer();
        }
    }, 1000);
}

// Function to start the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        // Reset everything when starting
        repCount = 1;
        tempoCount = 0;
        isHoldPhase = false;
        cycleCount = 0;
        isAlternating = alternatingCheckbox ? alternatingCheckbox.checked : false;
        // Start with the side that's selected via radio button, default to Left
        const leftSelected = alternatingLeftRadio ? alternatingLeftRadio.checked : false;
        const rightSelected = alternatingRightRadio ? alternatingRightRadio.checked : false;
        isLeftSide = rightSelected ? false : (leftSelected ? true : true);
        alternatingCycleCount = 0;
        repCountLeft = 1;
        repCountRight = 1;
        hasSwitchedOnce = false; // Reset switch tracking
        startTime = Date.now();
        repCycleStartTime = Date.now();
        tempoCycleStartTime = Date.now();
        
        if (isAlternating) {
            updateAlternatingVisibility(); // Show the correct side
            if (repCountDisplayLeft) repCountDisplayLeft.textContent = repCountLeft;
            if (repCountDisplayRight) repCountDisplayRight.textContent = repCountRight;
        } else {
            if (repCountDisplay) repCountDisplay.textContent = repCount;
        }
        tempoCountDisplay.textContent = tempoCount;
        if (timerDisplay) {
            timerDisplay.textContent = '00:00:00';
        }
        if (timerContainer) {
            timerContainer.classList.add('running');
        }
        if (repProgressBar) {
            repProgressBar.style.width = '0%';
        }
        if (repProgressBarLeft) {
            repProgressBarLeft.style.width = '0%';
        }
        if (repProgressBarRight) {
            repProgressBarRight.style.width = '0%';
        }
        if (tempoProgressBar) {
            tempoProgressBar.style.width = '0%';
        }
        
        // Start at 1, so we see 1, 2, 3 within 3 seconds
        tempoCount = 1;
        tempoCountDisplay.textContent = tempoCount;
        triggerScaleAnimation(tempoCountDisplay);
        
        // Update timer display every 2ms for smooth display
        timerInterval = setInterval(updateTimer, 2);
        
        // Update tempo-count exactly every 1000ms (1 second)
        tempoInterval = setInterval(updateTempoCount, 1000);
    }
}

// Function to stop the timer
function stopTimer() {
    if (isRunning) {
        isRunning = false;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (tempoInterval) {
            clearInterval(tempoInterval);
            tempoInterval = null;
        }
        if (timerContainer) {
            timerContainer.classList.remove('running');
        }
    }
    if (isCountdown) {
        isCountdown = false;
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        if (timerDisplay) {
            timerDisplay.textContent = '00:00:00';
        }
        if (timerContainer) {
            timerContainer.classList.remove('running');
        }
    }
    updateButtonText();
}

// Function to update button text
function updateButtonText() {
    if (startStopButton) {
        if (isRunning || isCountdown) {
            startStopButton.textContent = 'Stop';
            startStopButton.style.backgroundColor = 'var(--red)';
        } else {
            startStopButton.textContent = 'Start';
            startStopButton.style.backgroundColor = 'var(--dark-blue)';
        }
    }
}

// Function to handle start/stop
function handleStartStop() {
    if (isRunning || isCountdown) {
        stopTimer();
    } else {
        startCountdown();
    }
    updateButtonText();
}

// Listen for spacebar press
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent page scroll
        handleStartStop();
    }
});

// Listen for button click
if (startStopButton) {
    startStopButton.addEventListener('click', handleStartStop);
}

// Validate countdown input
if (countdownInput) {
    countdownInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            e.target.value = 1;
        } else if (value > 10) {
            e.target.value = 10;
        }
    });
}

// Update alternating display when checkbox changes
if (alternatingCheckbox) {
    alternatingCheckbox.addEventListener('change', updateAlternatingDisplay);
}

// Update visibility when radio buttons change
if (alternatingLeftRadio) {
    alternatingLeftRadio.addEventListener('change', updateAlternatingVisibility);
}

if (alternatingRightRadio) {
    alternatingRightRadio.addEventListener('change', updateAlternatingVisibility);
}

// Initialize alternating display
updateAlternatingDisplay();

// Initialize button text
updateButtonText();


