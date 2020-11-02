let iframesCount = 0;
let iframesLoaded = 0;
let $;
const iframes = ["Map", "Player", "Journal"];

/////////////////////////////////////
/// register listener to receive and send message
/////////////////////////////////////
window.addEventListener("message", function (event) {
  for (let i = 0; i < window.frames.length; i++) {
    window.frames[i].postMessage(event.data, "*");
  }
});

function checkForAllIframesLoaded() {
  iframesLoaded++;
  if (iframesLoaded == iframesCount) {
    
    /// send message to all iframes
    /// to register to parentWindow
    for (let i = 0; i < window.frames.length; i++) {
      window.frames[i].postMessage("hello", "*");
    }
  }
}

class iframeLoadingState {
  constructor(_iframe) {
    this.iframe = _iframe;
    this.iframeDoc = _iframe.contentDocument || _iframe.contentWindow.document;
    this.check();
  }
  check() {
    iframesCount++;

    if (this.iframeDoc.readyState == "complete") {
      checkForAllIframesLoaded();
    } else {
      $(this.iframe).on("load", function () {
        checkForAllIframesLoaded();
      });
    }
  }
}


function init() {
  iframes.forEach((el) => {
    if (typeof window.frames[el] !== "undefined") {
        const iframe = new iframeLoadingState(document.getElementsByName(el)[0]);
    }
  });
}


(function () {
  /// Load Jquery
  const script = document.createElement("SCRIPT");
  script.src =
    "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
  script.type = "text/javascript";
  script.onload = function () {
    $ = window.jQuery;
    init();
  };
  document.getElementsByTagName("head")[0].appendChild(script);
})();
