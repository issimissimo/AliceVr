let iframesCount = 0;
let iframesLoaded = 0;
var $;

function init() {
    if (typeof window.frames.testReceiver1 !== "undefined") {
        iframesCount++;
        $(function () {
            let iframe = document.getElementsByName("testReceiver1")[0]
            $(iframe).ready(function () {
                checkForIframesLoaded();
            });
        });
    };
    if (typeof window.frames.testReceiver2 !== "undefined") {
        iframesCount++;
        $(function () {
            let iframe = document.getElementsByName("testReceiver2")[0]
            $(iframe).ready(function () {
                checkForIframesLoaded();
            });
        });
    };
    if (typeof window.frames.testReceiver3 !== "undefined") {
        iframesCount++;
        $(function () {
            let iframe = document.getElementsByName("testReceiver3")[0]
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



setTimeout(() => {

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


}, 5000);