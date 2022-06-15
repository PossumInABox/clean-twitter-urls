// ==UserScript==
// @name         Clean Twitter Outbound URLs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Userscript to remove t.co outbound tracking links from tweets
// @author       PossumInABox
// @grant        none
// @include		 https://twitter.com*
// @downloadURL  https://possuminabox.github.io/clean-twitter-urls/cleantwitterurls.user.js
// @updateURL    https://possuminabox.github.io/clean-twitter-urls/cleantwitterurls.user.js
// ==/UserScript==


(function() {

// add css
    let styles = `<style>
#cleanLinks {
    font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: white;
    font-size: inherit;
}

#cleanLinks:hover {
    cursor: pointer;
}

#cleanLinks:active {
    color: lightblue;
}

#cleanLinks a {
    color: inherit;
    font: inherit;
    font-size: inherit;
}

.linkIcon {
    width: 1.75rem;
    font-size: x-large;
}
</style>`

    document.head.insertAdjacentHTML("beforeend", styles)



    // userscript
    // replace t.co outbound tracking links with real url
    const tweetSelector = '[data-testid="tweetText"]'
    const linkSelector = 'a[target="_blank"][role="link"]'

    function replaceURL(a) {
        let actualURL = a.innerText.replace('…', '')
        a.setAttribute("href", actualURL)
    }

    function processURLs() {
        let links = document.querySelectorAll(`${tweetSelector} ${linkSelector}`)
        links.forEach(a => {
            replaceURL(a)
        })
    }

    // html for button
    let cleanButtonHTML = `<a id="cleanLinks" role="link">
	<div class="css-1dbjc4n r-1awozwy r-sdzlij r-18u37iz r-1777fci r-dnmrzs r-xyw6el r-o7ynqc r-6416eg">
		<div class="css-1dbjc4n linkIcon">
			<span>&#8466;</span>
		</div>
		<div class="css-901oao css-bfa6kz r-vlxjld r-37j5jr r-adyw6z r-16dba41 r-135wba7 r-1joea0r r-88pszg r-bcqeeo r-qvutc0">
			<span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Clean Links</span>
		</div>
	</div>
    </a>`

    // wait for twitter to load after dom ready, injecting it immediately appears to fail
    setTimeout(() => {
        // make button to force run script
        let nav = document.querySelector('nav[role="navigation"]')
        nav.innerHTML += cleanButtonHTML
        document.getElementById("cleanLinks").addEventListener('click', processURLs);
    }, 500)


    // wait for api to load tweet data before running replace function
    // 2.5s appears to work, shorter times do not
    setTimeout(() => {
        processURLs()
    }, 2500)

    console.debug("Loaded module: Clean Twitter URLs by PossumInABox | See: https://github.com/PossumInABox/clean-twitter-urls")


})()