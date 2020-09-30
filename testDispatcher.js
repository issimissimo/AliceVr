let iframes = [];
let iframe = {
    name: "",
    loaded: false,
};

let allIframesLoaded = false;


/// collect iframes
if (typeof window.frames.testReceiver1 !== "undefined") {
    iframe.name = "testReceiver1";
    iframes.push(iframe);
}
if (typeof window.frames.testReceiver2 !== "undefined") {
    iframe.name = "testReceiver2";
    iframes.push(iframe);
}
if (typeof window.frames.testReceiver3 !== "undefined") {
    iframe.name = "testReceiver3";
    iframes.push(iframe);
}




/////////////////////////////////////////////////////
/// send 1st message to iframes to send the source
/////////////////////////////////////////////////////
setTimeout(() => {

    for (let i in iframes) {
        window.frames[i].postMessage("hello", "*");
    }

}, 1000)



/// on received message
window.addEventListener("message", function (event) {
    console.log("-------------------");
    console.log("sono Main e ho ricevuto:");
    console.log(event.data);
    console.log("-------------------");

    // ///send message to all iframes
    // for (let i in iframes) {
    //     window.frames[i].postMessage(event.data, "*");
    // }

});








// var iframeWindow = window.frames.testReceiver1;
var iframeElement = document.getElementsByName("testReceiver1")[0];


iframeElement.addEventListener("load", function () {
    console.log("testReceiver1 - loaded")
});



    // setTimeout(() => {

    //     if (typeof iframeWindow !== "undefined") {

    //         let data = "paperino"
    //         // iframeWindow.postMessage(data, "*");
    //         window.frames[0].postMessage(data, "*");

    //     }


    // }, 1000)