import Map from "../Map.js";


let maxProgress = 0;
let isLoading = true;
let tileQueue = [];
let tileQueueSum = 0;
let prevTileQueSum = -1;
let isZeroTileReached = false;
let checkForTimeout = null;

/// set this variable to hide the preloader
/// when a minimum is reached
const minimumTileQueuSum = 30;



function addToQueue(n) {
    if (tileQueue.length === 3) {
        tileQueue.shift();
        tileQueue.push(n);
        tileQueueSum = tileQueue.reduce((a, b) => a + b, 0);
        // console.log("queue: " + tileQueueSum + " - prev: " + prevTileQueSum)

        if (tileQueueSum < minimumTileQueuSum && tileQueueSum < prevTileQueSum) {
            hide();

        } else {
            prevTileQueSum = tileQueueSum;
        }
    } else {
        tileQueue.push(n);
    }
}



/// stop the preloader if after 1 sec
/// no more tiles are loaded
/// (which mean that the map is loaded and do not rotate)
function waitTimeout() {
    if (checkForTimeout) clearInterval(checkForTimeout);
    checkForTimeout = setTimeout(() => {
        if (isLoading) {
            if (tileQueueSum < minimumTileQueuSum) hide();
            else waitTimeout();
        }
    }, 1000)
}



function hide() {
    isLoading = false;
    $(".preloader").fadeOut();

    /// send message that the preloading of the map is finished!
    window.dispatcher.sendMessage("mapPreloaderFinished");
};



export default class Preloader {

    static init() {

        Map.viewer.scene.globe.tileLoadProgressEvent.addEventListener((valProgress) => {
            if (isLoading) {
                if (valProgress === 0) {
                    isZeroTileReached = true;

                } else {

                    // /// get the progress in percentage
                    // if (isProgressing) {
                    if (valProgress > maxProgress) maxProgress = valProgress;
                    let mapLoadingPercent = (100 - (valProgress / maxProgress * 100)).toFixed(0);
                    $("#progressBar").css("right", (100 - mapLoadingPercent) + '%');
                }


                if (isZeroTileReached) {

                    // console.log(valProgress)
                    addToQueue(valProgress);


                    waitTimeout();

                    // /// stop the preloader if after 1 sec
                    // /// no more tiles are loaded
                    // /// (which mean that the map is loaded and do not rotate)
                    // if (checkForTimeout !== null) clearInterval(checkForTimeout);
                    // checkForTimeout = setTimeout(() => {
                    //     if (isLoading) {
                    //         hide();
                    //         console.log("TIMEOUT!")
                    //     }
                    // }, 1000)
                }
            }
        });
    };
}