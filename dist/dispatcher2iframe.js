let iframesCount = 0;
let iframesLoaded = 0;
var $;

function init() {
    if (typeof window.frames.Map !== "undefined") {
        console.log("*** c'è Map.html")
        iframesCount++;
        $(function() {
            let iframe = document.getElementsByName("Map")[0]
            $(iframe).ready(function() {
                console.log("*** Map.html caricato")
                checkForIframesLoaded();
            });
        });
    };
    if (typeof window.frames.Player !== "undefined") {
        console.log("*** c'è Player.html")
        iframesCount++;
        $(function() {
            let iframe = document.getElementsByName("Player")[0]
            $(iframe).ready(function() {
                console.log("*** Player.html caricato")
                checkForIframesLoaded();
            });
        });
    };
    if (typeof window.frames.Journal !== "undefined") {
        console.log("*** c'è Journal.html")
        iframesCount++;
        $(function() {
            let iframe = document.getElementsByName("Journal")[0]
            $(iframe).ready(function() {
                console.log("*** Journal.html caricato")
                checkForIframesLoaded();
            });
        });
    };
};

function checkForIframesLoaded() {
    iframesLoaded++;
    console.log("iframesCount:" + iframesCount + " -- iframesLoaded:" + iframesLoaded)
    if (iframesLoaded === iframesCount) {

        setTimeout(() => {


            console.log("***** MANDO HELLO *****")
                /// send message to all iframes
                /// to register to parentWindow

            var frames = window.frames;
            console.log("\\\\\\\\\\\\ CE NE SONO: " + frames.length)
            for (let i = 0; i < window.frames.length; i++) {
                window.frames[i].postMessage("hello", "*");
            };


        }, 2000)









        // if (typeof window.frames.Map !== "undefined") window.frames.Map.postMessage("hello", "*");
        // if (typeof window.frames.Player !== "undefined") window.frames.Player.postMessage("hello", "*");
        // if (typeof window.frames.Journal !== "undefined") window.frames.Journal.postMessage("hello", "*");
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
        console.log("*** jquery caricato")
        $ = window.jQuery;
        init();
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();