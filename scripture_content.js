// content script


let lastKnownScrollPosition = 0;
let ticking = false;

var body = document.body;
console.log(body.scrollHeight);

function checkBottom(scrollPos){
    console.log(scrollPos);

    if (Math.ceil(scrollPos + window.innerHeight) >= document.body.scrollHeight) {
        console.log("You're at the bottom!");

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

