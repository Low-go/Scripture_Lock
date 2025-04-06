// background script, for redirecting

const scriptureUrl = "https://www.churchofjesuschrist.org/study/scriptures/bofm";

browser.webRequest.onBeforeRequest.addListener(
  async function(details) {
    console.log("test");
    handleRedirectTiming();

    const storage = await browser.storage.local.get("redirectsUnlocked");

    const unlocked = storage.redirectsUnlocked === true;
    const isScripturePage = details.url.startsWith(scriptureUrl);

    if (unlocked || isScripturePage){
      return { cancel: false};
    }


    // Don't redirect if already on the scripture page
    // if (details.url.startsWith(scriptureUrl)) {
    //   return { cancel: false }; // Let the scripture page load normally
    // }
    
    // Only redirect main document requests, not resources so that css and images can load properly
    if (details.type === "main_frame") {
      return { redirectUrl: scriptureUrl };
    }
    
    return { cancel: false }; // Let other resources load
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

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
      console.log("here");
      console.log(`Time since last unlock attempt: ${elapsed}`);
    }
  });
}