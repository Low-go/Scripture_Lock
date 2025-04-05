// background script, for redirecting

const scriptureUrl = "https://www.churchofjesuschrist.org/study/scriptures/bofm";

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Don't redirect if already on the scripture page
    if (details.url.startsWith(scriptureUrl)) {
      return { cancel: false }; // Let the scripture page load normally
    }
    
    // Only redirect main document requests, not resources so that css and images can load properly
    if (details.type === "main_frame") {
      return { redirectUrl: scriptureUrl };
    }
    
    return { cancel: false }; // Let other resources load
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);