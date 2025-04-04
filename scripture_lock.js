redirect_url = "https://www.churchofjesuschrist.org/study/scriptures/bofm"

browser.webRequest.onBeforeRequest.addListener(
    function(details){
        if (details.url.startsWith(redirect_url)){
            return {}; // allow scripture page
        }
        return { redirect_url }; // force scripture page
    },
    { urls: ["<all_urls"] },
    ["blocking"]
);