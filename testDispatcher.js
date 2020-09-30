window.addEventListener("message", function (event) {

    console.log("received: " + event.data);

});

setTimeout(function () {

    console.log("MANDO....")
    let win = window.frames.testReceiver1;
    win.postMessage("message", "*");




}, 1000)