let iframesCount = 0;
let iframesLoaded = 0;
var $;

function init() {
    if (typeof window.frames.Map !== "undefined") {
        iframesCount++;
        $(function () {
            let iframe = document.getElementsByName("Map")[0]
            $(iframe).ready(function () {
                checkForIframesLoaded();
            });
        });
    };
    if (typeof window.frames.Player !== "undefined") {
        iframesCount++;
        $(function () {
            let iframe = document.getElementsByName("Player")[0]
            $(iframe).ready(function () {
                checkForIframesLoaded();
            });
        });
    };
    if (typeof window.frames.Journal !== "undefined") {
        iframesCount++;
        $(function () {
            let iframe = document.getElementsByName("Journal")[0]
            $(iframe).ready(function () {
                checkForIframesLoaded();
            });
        });
    };
};

function checkForIframesLoaded() {
    iframesLoaded++;
    if (iframesLoaded === iframesCount) {

        /// send message to all iframes
        /// to register to parentWindow
        for (let i = 0; i < iframesCount; i++) {
            window.frames[i].postMessage("hello", "*");
        };
    };
};




/////////////////////////////////////
/// register listener to receive message from dispatchers
/////////////////////////////////////
window.addEventListener("message", function (event) {

    ///send message to all iframes
    for (let i = 0; i < iframesCount; i++) {
        window.frames[i].postMessage(event.data, "*");
    }

});





(function () {
    /// Load Jquery
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function () {
        $ = window.jQuery;
        init();
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();


