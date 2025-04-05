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
        })
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
    const circleContainer = document.createElement('div');
    circleContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background-color: red;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    document.body.appendChild(circleContainer);

    return {
      container: circleContainer,
    };
}


function unlock(unlocked){
    if(unlocked && lockAnimation){
        document.body.removeChild(lockAnimation.container);
    }
}

lockAnimation = createLockAnimation();

