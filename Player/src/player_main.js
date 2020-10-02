import Clappr_player from "../lib/Clappr_player.js";
import OmniVirt_player from "../lib/OmniVirt_player.js";
import * as overlay from "../lib/overlay.js";
import * as subtitles from "../lib/subtitles.js";
import SplashScreen from "../lib/UI/SplashScreen.js"




/********************************************
Swap player on platform
********************************************/
let player;
console.log("****************************************")
console.log(WURFL.complete_device_name)
console.log("****************************************")
// if (WURFL.complete_device_name === "Microsoft Edge" || WURFL.complete_device_name === "Apple iPhone" ||
//     WURFL.complete_device_name === "Apple Safari")
if (WURFL.complete_device_name === "Microsoft Edge") {
    player = OmniVirt_player;
    $("#Clappr-container").remove();
    $("#poster-textContainer").css("max-height", "27%");
    $("#poster-textContainer").css("bottom", "60px");
} else {
    player = Clappr_player;
    $("#OmniVirt-container").remove();
}







/********************************************
Register handlers
********************************************/
player.onReadyHandlers.push(function () {
    // $("#videoPlayer-preloader").fadeOut();

    if (SplashScreen.enabled) SplashScreen.hide();
    overlay.showOnReady();
});

player.onStartedHandlers.push(function () {
    window.dispatcher.sendMessage("playerStarted");
    overlay.showOnPlay();
});

player.onPausedHandlers.push(function () {
    window.dispatcher.sendMessage("playerPaused");
});

player.onSeekedHandlers.push(function () {
    window.dispatcher.sendMessage("playerSeeking");
    subtitles.restart();
});

player.onEndedHandlers.push(function () {
    window.dispatcher.sendMessage("playerEnded");
    overlay.showOnReady();
});






/********************************************
Receive messages
********************************************/
window.dispatcher.receiveMessage("rootAssetClicked", function (asset) {
    player.stop();
    SplashScreen.show(asset);
});

window.dispatcher.receiveMessage("videoAssetClicked", function (asset) {
    player.load(asset);
    overlay.load(player, asset);
    subtitles.load(asset);
    // console.log(asset)
});

window.dispatcher.receiveMessage("videoPlayerPlay", function () {
    player.play();
});

window.dispatcher.receiveMessage("videoPlayerSeek", function (time) {
    player.seek(time);
});






let oldTime = 0;
const t = () => {
    setInterval(() => {

        let time = player.time;
        if (player.isPlaying && time !== oldTime) {

            oldTime = time;

            //////////////////////////////////////////////
            /// send message during playback
            //////////////////////////////////////////////
            let angle = player.angle;
            window.dispatcher.sendMessage("playerPlaying", {
                time: time,
                angle: angle,
            });


            //////////////////////////////////////////////
            /// rotate overlay viewAngle
            //////////////////////////////////////////////
            overlay.viewAngle.rotate(angle);



            //////////////////////////////////////////////
            /// check for subtitles
            //////////////////////////////////////////////
            subtitles.check(time);
        }

        else if (player.isPlaying && time == oldTime){
            let angle = player.angle;
            window.dispatcher.sendMessage("playerPaused", {
                angle: angle,
            });
        }


        else if (player.isPaused) {
            let angle = player.angle;
            window.dispatcher.sendMessage("playerPaused", {
                angle: angle,
            });
        }



    }, 500);
}

t();
