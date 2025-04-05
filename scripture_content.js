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
    const lockContainer = document.createElement('div');
    lockContainer.style.cssText = `
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
    document.body.appendChild(lockContainer);

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



.top-lock{
    width: 100px;
    height: 100px;
    border: 6px solid grey;
    border-bottom-left-radius: 110px;
    border-bottom-right-radius: 110px;
    position: absolute;
    top: 93px;
    left: 68px;
    content: "";
    z-index: 5;
    border-top-left-radius: 110px;
    border-top-right-radius: 110px;
}

.lockBody{
    width: 150px;
    height: 150px;
    background: rgb(37, 35, 37);
    border: 4px solid #fff;
    border-radius: 20px;
    position: absolute;
    left: 43px;
    top: 150px;
    text-align: CSSLayerBlockRule;
    z-index: 6;
}