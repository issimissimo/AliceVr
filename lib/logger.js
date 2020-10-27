const states = {
    ENABLED: 'enabled',
    DISABLED: 'disabled',
}

let loggerState = states.ENABLED;


function disableLog() {
    loggerState = states.DISABLED;
    console.log = function() {};
    console.warn = function() {};
}

function getInitParameter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shipping = urlParams.get('shipping');

    if (shipping === "release") {
        disableLog();
        return;
    } else if (shipping === "debug") {
        console.log("++ log enabled ++");
        return;
    }
    alert("Please check your iframe shipping parameter");
}


getInitParameter();