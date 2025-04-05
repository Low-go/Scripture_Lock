// content script
let lastKnownScrollPosition = 0;
let ticking = false;
let lockAnimation;
var body = document.body;
console.log(body.scrollHeight);

function checkBottom(scrollPos){
    console.log(scrollPos);
    if (Math.ceil(scrollPos + window.innerHeight) >= document.body.scrollHeight) {
        console.log("You're at the bottom!");
        bottom = true;
        unlock(bottom);
        browser.storage.local.set({ redirectsUnlocked: true}, () => { // local storage save to persist even after browser restart
            console.log("Redirects unlocked flag saved!");            // sets variable to true
        });
    }
}

addEventListener("scroll", (event) => {
    lastKnownScrollPosition = window.scrollY;
    if (!ticking){
        window.requestAnimationFrame(() => {
            checkBottom(lastKnownScrollPosition);
            ticking = false;
        });
        ticking = true;
    }
});

function createLockAnimation() {
    // Create main container
    const lockContainer = document.createElement('div');
    lockContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 100px;
      height: 100px;
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(0.6);
    `;

    // Create top lock part
    const topLock = document.createElement('div');
    topLock.className = 'top-lock';
    topLock.style.cssText = `
      width: 60px;
      height: 40px;
      border: 8px solid #3d5a80;
      border-radius: 110px 110px 0 0;
      position: absolute;
      top: 0;
      left: 16px;
      z-index: 5;
    `;

    // Create lock body
    const lockBody = document.createElement('div');
    lockBody.className = 'lockBody';
    lockBody.style.cssText = `
      width: 90px;
      height: 70px;
      background: #293241;
      border: 3px solid #98c1d9;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      position: absolute;
      top: 35px;
      left: 2px;
      z-index: 4;
    `;
    
    // Create keyhole
    const keyhole = document.createElement('div');
    keyhole.className = 'keyhole';
    keyhole.style.cssText = `
      position: absolute;
      bottom: 15px;
      left: 15px;
      width: 18px;
      height: 18px;
      background: #98c1d9;
      border-radius: 50%;
      z-index: 7;
    `;
    
    // Create keyhole slit
    const keyholeSlot = document.createElement('div');
    keyholeSlot.className = 'keyhole-slot';
    keyholeSlot.style.cssText = `
      position: absolute;
      bottom: 8px;
      left: 21px;
      width: 6px;
      height: 12px;
      background: #98c1d9;
      z-index: 7;
    `;

    // Add elements to container
    lockContainer.appendChild(topLock);
    lockContainer.appendChild(lockBody);
    lockBody.appendChild(keyhole);
    lockBody.appendChild(keyholeSlot);
    
    // Add container to page
    document.body.appendChild(lockContainer);
    
    return {
      container: lockContainer
    };
}

function unlock(unlocked){
    if(unlocked && lockAnimation){
        document.body.removeChild(lockAnimation.container);
    }
}

lockAnimation = createLockAnimation();