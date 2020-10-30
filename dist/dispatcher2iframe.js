let iframesCount = 0;
let iframesLoaded = 0;
var $;

function init() {
    if (typeof window.frames.Map !== "undefined") {
        iframesCount++;
        const map = document.getElementsByName("Map")[0]
        $(map).on('load', function() {
            console.log(">>>>>>>Map loaded")
            checkForIframesLoaded();
        });
    };
    if (typeof window.frames.Player !== "undefined") {
        iframesCount++;
        const player = document.getElementsByName("Player")[0]
        $(player).on('load', function() {
            console.log(">>>>>>>Player loaded")
            checkForIframesLoaded();
        });
    };
    if (typeof window.frames.Journal !== "undefined") {
        iframesCount++;
        const journal = document.getElementsByName("Journal")[0]
        $(journal).on('load', function() {
            console.log(">>>>>>>Journal loaded")
            checkForIframesLoaded();
        });
    };
};

function checkForIframesLoaded() {
    iframesLoaded++;
    console.log(">>>iframesCount:" + iframesCount + " -- iframesLoaded:" + iframesLoaded)
    if (iframesLoaded === iframesCount) {

        console.log(">>>>>>>MANDO HELLO")
        /// send message to all iframes
        /// to register to parentWindow
        for (let i = 0; i < window.frames.length; i++) {
            window.frames[i].postMessage("hello", "*");
        };
    };
};




/////////////////////////////////////
/// register listener to receive message from dispatchers
/////////////////////////////////////
window.addEventListener("message", function(event) {

    ///send message to all iframes
    for (let i = 0; i < window.frames.length; i++) {
        window.frames[i].postMessage(event.data, "*");
    }

});





(function() {
    /// Load Jquery
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        $ = window.jQuery;
        init();
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();