const scriptureUrl = "https://www.churchofjesuschrist.org/study/scriptures/bofm";
const LOCK_AFTER_MS = 60000; // 1 minute

browser.webRequest.onBeforeRequest.addListener(
  async function(details) {
    const storage = await browser.storage.local.get("redirectsUnlocked");
    let unlocked = storage.redirectsUnlocked === true;
    const isScripturePage = details.url.startsWith(scriptureUrl);
    //lets test this
    if (unlocked) {
      unlocked = await handleRedirectTiming();
    }
    
    if (unlocked || isScripturePage) {
      return { cancel: false };
    }
    
    if (details.type === "main_frame") {
      return { redirectUrl: scriptureUrl };
    }
   
    return { cancel: false }; // Let other resources load
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

async function handleRedirectTiming() {
  const result = await browser.storage.local.get(['savedTimestamp', 'redirectsUnlocked']);
  const saved = result.savedTimestamp; // putting data over here
  const now = Date.now();              // retrieving it before use
  
  if (!saved) {
    await browser.storage.local.set({savedTimestamp: now});
    console.log("Initial timestamp saved at:", new Date(now).toLocaleString());
    return true;
  }
  
  // saves time passed,
  const elapsedMs = now - saved;
  console.log("Time since last unlock:", elapsedMs, "ms");
  
  // checks if it exceeds relock value
  if (elapsedMs > LOCK_AFTER_MS) {
    console.log("Lock timeout reached. Redirects locked again");
    await browser.storage.local.set({ 
      redirectsUnlocked: false,
      savedTimestamp: null
    });
    return false;
  }
  
  return true;
}

// Listen for messages from content script
// variables set if unlocked
browser.runtime.onMessage.addListener(async function(message) {
  if (message.action === "unlock") {
    await browser.storage.local.set({
      redirectsUnlocked: true,
      savedTimestamp: Date.now()
    });
    console.log("Redirects unlocked from content script message");
    return {success: true};
  }
});