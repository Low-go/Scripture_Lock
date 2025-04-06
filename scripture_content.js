
let lastKnownScrollPosition = 0;
let ticking = false;
let lockAnimation;
let isUnlocked = false;

console.log("conetnt script loaded");
// Check if redirects are already unlocked from previous sessions
browser.storage.local.get('redirectsUnlocked', (result) => {
  if (result.redirectsUnlocked) {
    console.log("Redirects were previously unlocked!");
    isUnlocked = true;
    handleRedirectTiming();
  } else {
    // Create lock animation only if not previously unlocked
    lockAnimation = createLockAnimation();
  }
});

// Check if user has scrolled to the bottom
function checkBottom(scrollPos) {
  if (Math.ceil(scrollPos + window.innerHeight) >= document.body.scrollHeight) {
    console.log("You're at the bottom!");
    
    if (!isUnlocked) {
      isUnlocked = true;
      unlock();
      
      // Save unlocked state to persist after browser restart
      browser.storage.local.set({ redirectsUnlocked: true }, () => {
        console.log("Redirects unlocked flag saved!");
      });
    }
  }
}

// Scroll event listener with animation frame for performance
addEventListener("scroll", () => {
  lastKnownScrollPosition = window.scrollY;
  
  if (!ticking) {
    window.requestAnimationFrame(() => {
      checkBottom(lastKnownScrollPosition);
      ticking = false;
    });
    ticking = true;
  }
});

// Create the lock animation UI
function createLockAnimation() {
  // Lock colors
  const lockedColor = "#3d5a80";
  const unlockedColor = "#00b300";
  const lockBodyColor = "#293241";
  const keyholeColor = "#98c1d9";
  
  // Create main container
  const lockContainer = document.createElement('div');
  lockContainer.id = 'lock-container';
  lockContainer.style.cssText = `
    position: fixed;
    bottom: 25px;
    right: 85px;
    width: 100px;
    height: 100px;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.6);
    transition: all 0.5s ease;
  `;

  // Create top lock part
  const topLock = document.createElement('div');
  topLock.id = 'top-lock';
  topLock.style.cssText = `
    width: 60px;
    height: 40px;
    border: 8px solid ${lockedColor};
    border-radius: 110px 110px 0 0;
    position: absolute;
    top: 0;
    left: 16px;
    z-index: 5;
    transition: transform 0.7s ease, border-color 0.5s ease;
  `;

  // Create lock body
  const lockBody = document.createElement('div');
  lockBody.id = 'lock-body';
  lockBody.style.cssText = `
    width: 90px;
    height: 70px;
    background: ${lockBodyColor};
    border: 3px solid ${keyholeColor};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    position: absolute;
    top: 35px;
    left: 2px;
    z-index: 4;
    transition: border-color 0.5s ease;
  `;
  
  // Create slider container (replacing keyhole)
  const sliderContainer = document.createElement('div');
  sliderContainer.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;
  
  // Create switch label
  const switchLabel = document.createElement('label');
  switchLabel.className = 'switch';
  switchLabel.htmlFor = 'lock-toggle';
  switchLabel.style.cssText = `
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;
  `;
  
  // Create toggle input
  const toggleInput = document.createElement('input');
  toggleInput.id = 'lock-toggle';
  toggleInput.type = 'checkbox';
  toggleInput.style.cssText = `
    opacity: 0;
    width: 0;
    height: 0;
  `;
  
  // Create slider element
  const slider = document.createElement('span');
  slider.className = 'slider round';
  slider.style.cssText = `
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #aaa;
    transition: .4s;
    border-radius: 34px;
  `;
  
  // Create slider thumb
  slider.innerHTML = `<span style="
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  "></span>`;
  
  // Assemble the elements
  switchLabel.appendChild(toggleInput);
  switchLabel.appendChild(slider);
  sliderContainer.appendChild(switchLabel);
  lockBody.appendChild(sliderContainer);
  
  lockContainer.appendChild(topLock);
  lockContainer.appendChild(lockBody);
  
  // Add container to page
  document.body.appendChild(lockContainer);
  
  // Add custom CSS for slider
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #lock-toggle:checked + .slider {
      background-color: #00b300;
    }
    
    #lock-toggle:focus + .slider {
      box-shadow: 0 0 1px #21f344;
    }
    
    #lock-toggle:checked + .slider > span {
      transform: translateX(16px);
    }
  `;
  document.head.appendChild(styleElement);
  
  return {
    container: lockContainer,
    topLock: topLock,
    lockBody: lockBody,
    toggle: toggleInput
  };
}

// Handle unlocking animation and state
function unlock() {
  if (!lockAnimation || !lockAnimation.container) return;
  
  // Colors for unlocked state
  const unlockedColor = "#00b300";
  
  // Play unlock animation
  lockAnimation.toggle.checked = true;
  lockAnimation.topLock.style.borderColor = unlockedColor;
  lockAnimation.topLock.style.transform = "translateY(-10px) rotateY(180deg)";
  lockAnimation.lockBody.style.borderColor = unlockedColor;
  
  // Add a subtle bounce effect
  setTimeout(() => {
    lockAnimation.container.style.transform = "scale(0.7)";
    
    setTimeout(() => {
      lockAnimation.container.style.transform = "scale(0.6)";
    }, 150);
  }, 300);
  
  // Keep the lock visible for 3 seconds before fading out
  setTimeout(() => {
    lockAnimation.container.style.opacity = "0";
    
    // Remove from DOM 
    setTimeout(() => {
      if (lockAnimation.container && lockAnimation.container.parentNode) {
        document.body.removeChild(lockAnimation.container);
      }
    }, 500);
  }, 3000);
}

// sees how much time has passed from internal storage

function handleRedirectTiming() {
  browser.storage.local.get('savedTimestamp', (result) => {
    if (!result.savedTimestamp){
      const now = Date.now();
      browser.storage.local.set({savedTimestamp: now}, () =>{
        console.log("initial timestamp saved at:", new Date(now).toLocaleString());
      });
    }
    else{
      const saved = result.savedTimestamp;
      const now = Date.now();
      const elapsed = formatElapsed(now - saved)
      console.log(`Time since last unlock attempt: ${elapsed}`);
    }
  });
}