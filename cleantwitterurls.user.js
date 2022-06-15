// ==UserScript==
// @name         Clean Twitter Outbound URLs
// @namespace    https://github.com/PossumInABox/clean-twitter-urls
// @homepage	 https://github.com/PossumInABox/clean-twitter-urls
// @version      2.3
// @description  Userscript to remove t.co outbound tracking links from tweets
// @author       PossumInABox
// @grant        none
// @include	 https://twitter.com*
// @downloadURL  https://possuminabox.github.io/clean-twitter-urls/cleantwitterurls.user.js
// @updateURL    https://possuminabox.github.io/clean-twitter-urls/cleantwitterurls.user.js
// ==/UserScript==


(function() {


    // detect theme
    let linkColor = "white"
    let hoverColor = "rgba(247, 249, 249, 0.1)"
    if (document.body.style.backgroundColor === 'rgb(255, 255, 255)') {
        linkColor = "black"
        hoverColor = "rgba(15, 20, 25, 0.1)"
    }

// add css
    const styles = `<style>
#cleanLinks {
    font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: ${linkColor}!important;
    font-size: inherit;
}

#cleanLinks div {
    color: ${linkColor}!important;
}

#cleanLinks:hover {
    cursor: pointer;
}

#cleanLinks>div:hover {
    border-radius: 30px;
    background-color: ${hoverColor};
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

.cleaned {
    color: #04db7d!important;
}
</style>`

    document.head.insertAdjacentHTML("beforeend", styles)



    // userscript
    // replace t.co outbound tracking links with real url
    const tweetSelector = '[data-testid="tweetText"]'
    const bioSelector = 'div[data-testid="UserDescription"]'
    const headerItemsSelector = 'div[data-testid="UserProfileHeader_Items"]'
    const linkSelector = 'a[target="_blank"][role="link"]'
    const linkSelectorNoRole = 'a[target="_blank"][role="none"]'

    const linkInTweet = `${tweetSelector} ${linkSelector}`
    const linkInBio = `${bioSelector} ${linkSelector}, ${headerItemsSelector} ${linkSelectorNoRole}`

    function replaceURL(a) {
        let actualURL = a.innerText.replace('…', '')
        if (!actualURL.match(/^http[s]?:\/\//)) {
                actualURL = 'https://' + actualURL
            }

        a.setAttribute("href", actualURL)
        a.classList.add("cleaned")
    }

    function processURLs() {
        let links = document.querySelectorAll(`${linkInTweet}, ${linkInBio}`)
        links.forEach(a => {
            replaceURL(a)
        })
    }

    // html for button
    const cleanButtonHTML = `<a id="cleanLinks" role="link">
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
        nav.insertAdjacentHTML("beforeend", cleanButtonHTML)
        document.getElementById("cleanLinks").addEventListener('click', processURLs);
    }, 500)


    // wait for api to load tweet data before running replace function
    // 2.5s appears to work, shorter times do not
    setTimeout(() => {
        processURLs()
    }, 2500)

    console.info("Loaded module: Clean Twitter URLs by PossumInABox | See: https://github.com/PossumInABox/clean-twitter-urls")


})()
