// content script


let lastKnownScrollPosition = 0;
let ticking = false;

var body = document.body;
console.log(body.scrollHeight);

function checkBottom(scrollPos){
    console.log(scrollPos);

    if (Math.ceil(scrollPos + window.innerHeight) >= document.body.scrollHeight) {
        console.log("You're at the bottom!");
    }
}

addEventListener("scroll", (event) => {

    lastKnownScrollPosition = window.scrollY;

    if (!ticking){
        window.requestAnimationFrame(() => {
            doSomething(lastKnownScrollPosition);
            ticking = false;
        });

        ticking = true;
    }
});

onscroll = (event) => {};